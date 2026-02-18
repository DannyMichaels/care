require 'rails_helper'

RSpec.describe 'PushTokens', type: :request do
  let!(:user) { create(:user) }
  let!(:headers) { auth_headers(user) }

  describe 'POST /push_tokens' do
    it 'creates a push token' do
      expect {
        post '/push_tokens', params: { token: 'ExponentPushToken[abc123]', platform: 'android' }, headers: headers
      }.to change(PushToken, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it 'reuses existing token for same user' do
      post '/push_tokens', params: { token: 'ExponentPushToken[abc123]', platform: 'android' }, headers: headers
      expect {
        post '/push_tokens', params: { token: 'ExponentPushToken[abc123]', platform: 'ios' }, headers: headers
      }.not_to change(PushToken, :count)
    end

    it 'requires authentication' do
      post '/push_tokens', params: { token: 'ExponentPushToken[abc123]' }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'DELETE /push_tokens/:id' do
    let!(:push_token) { create(:push_token, user: user) }

    it 'deletes the push token' do
      expect {
        delete "/push_tokens/#{push_token.id}", headers: headers
      }.to change(PushToken, :count).by(-1)
    end
  end
end
