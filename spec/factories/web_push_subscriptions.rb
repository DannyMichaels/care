FactoryBot.define do
  factory :web_push_subscription do
    sequence(:endpoint) { |n| "https://fcm.googleapis.com/fcm/send/#{n}" }
    p256dh { Base64.urlsafe_encode64(SecureRandom.random_bytes(65)) }
    auth { Base64.urlsafe_encode64(SecureRandom.random_bytes(16)) }
    user
  end
end
