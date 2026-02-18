# Patch web-push 1.0.0 for OpenSSL 3.0 compatibility
# OpenSSL 3.0 makes PKeys immutable — generate_key! / generate_key no longer works
# on an existing EC instance. Use OpenSSL::PKey::EC.generate instead.

require 'web_push'

module WebPush
  class VapidKey
    def initialize
      @curve = OpenSSL::PKey::EC.generate('prime256v1')
    end

    def public_key=(key)
      # Rebuild the curve from components since OpenSSL 3.0 PKeys are immutable
      @_public_key_override = key
    end

    def private_key=(key)
      @_private_key_override = key
    end

    def curve
      if @_public_key_override && @_private_key_override
        @_rebuilt_curve ||= build_curve_from_keys(@_public_key_override, @_private_key_override)
      else
        @curve
      end
    end

    private

    def build_curve_from_keys(pub_key, priv_key)
      group = OpenSSL::PKey::EC::Group.new('prime256v1')
      pub_bn = OpenSSL::BN.new(WebPush.decode64(pub_key), 2)
      pub_point = OpenSSL::PKey::EC::Point.new(group, pub_bn)
      priv_bn = OpenSSL::BN.new(WebPush.decode64(priv_key), 2)

      asn1 = OpenSSL::ASN1::Sequence([
        OpenSSL::ASN1::Integer(1),
        OpenSSL::ASN1::OctetString(priv_bn.to_s(2)),
        OpenSSL::ASN1::ObjectId('prime256v1', 0, :EXPLICIT),
        OpenSSL::ASN1::BitString(pub_point.to_bn.to_s(2), 1, :EXPLICIT)
      ])

      OpenSSL::PKey::EC.new(asn1.to_der)
    end
  end

  module Encryption
    class << self
      def encrypt(message, p256dh, auth)
        assert_arguments(message, p256dh, auth)

        group_name = 'prime256v1'
        salt = Random.new.bytes(16)

        server = OpenSSL::PKey::EC.generate(group_name)
        server_public_key_bn = server.public_key.to_bn

        group = OpenSSL::PKey::EC::Group.new(group_name)
        client_public_key_bn = OpenSSL::BN.new(WebPush.decode64(p256dh), 2)
        client_public_key = OpenSSL::PKey::EC::Point.new(group, client_public_key_bn)

        shared_secret = server.dh_compute_key(client_public_key)

        client_auth_token = WebPush.decode64(auth)

        info = "WebPush: info\0" + client_public_key_bn.to_s(2) + server_public_key_bn.to_s(2)
        content_encryption_key_info = "Content-Encoding: aes128gcm\0"
        nonce_info = "Content-Encoding: nonce\0"

        prk = HKDF.new(shared_secret, salt: client_auth_token, algorithm: 'SHA256', info: info).next_bytes(32)
        content_encryption_key = HKDF.new(prk, salt: salt, info: content_encryption_key_info).next_bytes(16)
        nonce = HKDF.new(prk, salt: salt, info: nonce_info).next_bytes(12)

        ciphertext = encrypt_payload(message, content_encryption_key, nonce)

        serverkey16bn = convert16bit(server_public_key_bn)
        rs = ciphertext.bytesize
        raise ArgumentError, "encrypted payload is too big" if rs > 4096

        aes128gcmheader = "#{salt}" + [rs].pack('N*') + [serverkey16bn.bytesize].pack('C*') + serverkey16bn
        aes128gcmheader + ciphertext
      end
    end
  end
end
