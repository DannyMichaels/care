require 'rails_helper'

RSpec.describe 'EmailVerifications', type: :request do
  describe 'POST /email_verifications' do
    it 'creates a verification and sends email' do
      expect {
        post '/email_verifications', params: { email: 'test@example.com' }
      }.to have_enqueued_job.on_queue('default')

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['message']).to include('Verification code sent')
    end

    it 'deletes existing codes for the same email' do
      create(:email_verification, email: 'test@example.com')

      post '/email_verifications', params: { email: 'test@example.com' }

      expect(EmailVerification.where(email: 'test@example.com').count).to eq(1)
    end

    it 'returns error without email' do
      post '/email_verifications', params: {}

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'POST /email_verifications/verify' do
    let!(:user) { create(:user, email: 'verify@example.com') }
    let!(:verification) { create(:email_verification, email: 'verify@example.com') }

    context 'with valid code' do
      it 'verifies the email' do
        post '/email_verifications/verify', params: {
          email: 'verify@example.com',
          code: verification.code
        }

        expect(response).to have_http_status(:ok)
        expect(verification.reload.verified).to be true
        expect(user.reload.email_verified).to be true
      end
    end

    context 'with invalid code' do
      it 'returns error' do
        post '/email_verifications/verify', params: {
          email: 'verify@example.com',
          code: '000000'
        }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'with expired code' do
      before { verification.update_column(:expires_at, 1.minute.ago) }

      it 'returns error' do
        post '/email_verifications/verify', params: {
          email: 'verify@example.com',
          code: verification.code
        }

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['error']).to include('expired')
      end
    end
  end
end
