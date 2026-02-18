require 'rails_helper'

RSpec.describe 'WebPushSubscriptions', type: :request do
  let!(:user) { create(:user) }
  let!(:headers) { auth_headers(user) }

  describe 'GET /web_push/vapid_key' do
    it 'returns the vapid public key' do
      allow(ENV).to receive(:[]).and_call_original
      allow(ENV).to receive(:[]).with('VAPID_PUBLIC_KEY').and_return('test-vapid-key')

      get '/web_push/vapid_key'

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['vapid_public_key']).to eq('test-vapid-key')
    end

    it 'does not require authentication' do
      get '/web_push/vapid_key'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST /web_push_subscriptions' do
    let(:valid_params) do
      {
        endpoint: 'https://fcm.googleapis.com/fcm/send/new-sub',
        p256dh: Base64.urlsafe_encode64(SecureRandom.random_bytes(65)),
        auth: Base64.urlsafe_encode64(SecureRandom.random_bytes(16))
      }
    end

    it 'creates a web push subscription' do
      expect {
        post '/web_push_subscriptions', params: valid_params, headers: headers
      }.to change(WebPushSubscription, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it 'reuses existing subscription for same endpoint' do
      post '/web_push_subscriptions', params: valid_params, headers: headers
      expect {
        post '/web_push_subscriptions', params: valid_params.merge(auth: 'updated-auth'), headers: headers
      }.not_to change(WebPushSubscription, :count)
    end

    it 'requires authentication' do
      post '/web_push_subscriptions', params: valid_params
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'DELETE /web_push_subscriptions/:id' do
    let!(:subscription) { create(:web_push_subscription, user: user) }

    it 'deletes the subscription' do
      expect {
        delete "/web_push_subscriptions/#{subscription.id}", headers: headers
      }.to change(WebPushSubscription, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
