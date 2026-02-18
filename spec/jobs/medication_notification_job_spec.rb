require 'rails_helper'

RSpec.describe MedicationNotificationJob, type: :job do
  let!(:user) { create(:user) }
  let!(:medication) { create(:medication, user: user, name: 'Aspirin') }

  describe '#perform' do
    it 'skips if medication does not exist' do
      expect(HTTParty).not_to receive(:post)
      described_class.new.perform(-1)
    end

    it 'skips if medication is already taken' do
      medication.update!(is_taken: true)
      expect(HTTParty).not_to receive(:post)
      described_class.new.perform(medication.id)
    end

    it 'skips if med time changed since job was scheduled' do
      original_time = medication.time.to_s
      medication.update!(time: 2.hours.from_now)
      expect(HTTParty).not_to receive(:post)
      described_class.new.perform(medication.id, original_time)
    end

    context 'with expo push tokens' do
      let!(:push_token) { create(:push_token, user: user) }

      it 'sends expo push notification' do
        expect(HTTParty).to receive(:post).with(
          'https://exp.host/--/api/v2/push/send',
          hash_including(
            body: anything,
            headers: hash_including('Content-Type' => 'application/json')
          )
        )

        described_class.new.perform(medication.id)
      end

      it 'includes medication name in the notification body' do
        expect(HTTParty).to receive(:post) do |_url, options|
          body = JSON.parse(options[:body])
          expect(body.first['body']).to include('Aspirin')
        end

        described_class.new.perform(medication.id)
      end
    end

    context 'with web push subscriptions' do
      let!(:subscription) { create(:web_push_subscription, user: user) }

      before do
        allow(ENV).to receive(:[]).and_call_original
        allow(ENV).to receive(:[]).with('VAPID_SUBJECT').and_return('mailto:test@example.com')
        allow(ENV).to receive(:[]).with('VAPID_PUBLIC_KEY').and_return('test-public-key')
        allow(ENV).to receive(:[]).with('VAPID_PRIVATE_KEY').and_return('test-private-key')
      end

      it 'sends web push notification' do
        expect(WebPush).to receive(:payload_send).with(
          hash_including(
            endpoint: subscription.endpoint,
            p256dh: subscription.p256dh,
            auth: subscription.auth
          )
        )

        described_class.new.perform(medication.id)
      end

      it 'deletes expired subscriptions' do
        fake_response = double('response', body: 'expired')
        expect(WebPush).to receive(:payload_send).and_raise(WebPush::ExpiredSubscription.new(fake_response, 'host'))

        expect {
          described_class.new.perform(medication.id)
        }.to change(WebPushSubscription, :count).by(-1)
      end

      it 'deletes invalid subscriptions' do
        fake_response = double('response', body: 'invalid')
        expect(WebPush).to receive(:payload_send).and_raise(WebPush::InvalidSubscription.new(fake_response, 'host'))

        expect {
          described_class.new.perform(medication.id)
        }.to change(WebPushSubscription, :count).by(-1)
      end
    end

    context 'with no tokens or subscriptions' do
      it 'completes without error' do
        expect { described_class.new.perform(medication.id) }.not_to raise_error
      end
    end
  end
end
