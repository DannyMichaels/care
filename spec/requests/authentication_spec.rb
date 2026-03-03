require 'rails_helper'

RSpec.describe 'Authentication', type: :request do
  describe 'POST /auth/login' do
    let!(:user) { create(:user, email: 'test@example.com', password: 'password123') }

    context 'with valid credentials' do
      it 'returns a token and user data' do
        post '/auth/login', params: { authentication: { email: 'test@example.com', password: 'password123' } }

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
        expect(json['user']['email']).to eq('test@example.com')
        expect(json['user']).not_to have_key('password_digest')
      end
    end

    context 'with invalid email' do
      it 'returns unauthorized' do
        post '/auth/login', params: { authentication: { email: 'wrong@example.com', password: 'password123' } }

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with invalid password' do
      it 'returns unauthorized' do
        post '/auth/login', params: { authentication: { email: 'test@example.com', password: 'wrongpassword' } }

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with empty credentials' do
      it 'returns unauthorized' do
        post '/auth/login', params: { authentication: { email: '', password: '' } }

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /auth/verify' do
    let!(:user) { create(:user) }

    context 'with valid token' do
      it 'returns current user data' do
        get '/auth/verify', headers: auth_headers(user)

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['email']).to eq(user.email)
        expect(json).not_to have_key('password_digest')
      end
    end

    context 'without token' do
      it 'returns unauthorized' do
        get '/auth/verify'

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /auth/reset_password' do
    let!(:user) { create(:user, email: 'reset@example.com', password: 'oldpassword1') }
    let!(:verification) { create(:email_verification, email: 'reset@example.com') }

    context 'with valid code and new password' do
      it 'resets the password' do
        post '/auth/reset_password', params: {
          email: 'reset@example.com',
          code: verification.code,
          new_password: 'newpassword1'
        }

        expect(response).to have_http_status(:ok)
        expect(user.reload.authenticate('newpassword1')).to eq(user)
        expect(verification.reload.verified).to be true
      end
    end

    context 'with invalid code' do
      it 'returns unprocessable entity' do
        post '/auth/reset_password', params: {
          email: 'reset@example.com',
          code: '000000',
          new_password: 'newpassword1'
        }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'with expired code' do
      before { verification.update_column(:expires_at, 1.minute.ago) }

      it 'returns unprocessable entity' do
        post '/auth/reset_password', params: {
          email: 'reset@example.com',
          code: verification.code,
          new_password: 'newpassword1'
        }

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['error']).to include('expired')
      end
    end

    context 'with missing params' do
      it 'returns unprocessable entity' do
        post '/auth/reset_password', params: { email: 'reset@example.com' }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'POST /auth/google' do
    let(:google_token_data) do
      {
        'sub' => 'google-uid-123',
        'email' => 'googleuser@gmail.com',
        'name' => 'Google User'
      }
    end

    before do
      allow(HTTParty).to receive(:get)
        .with(/oauth2\.googleapis\.com\/tokeninfo/)
        .and_return(double(success?: true, parsed_response: google_token_data))
    end

    context 'with valid token for new user' do
      it 'creates a user and returns token' do
        expect {
          post '/auth/google', params: { id_token: 'valid-google-token' }
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
        expect(json['user']['email']).to eq('googleuser@gmail.com')
        expect(json['user']['google_uid']).to eq('google-uid-123')
        expect(json['user']).not_to have_key('password_digest')
      end
    end

    context 'with valid token for existing email user' do
      let!(:existing_user) { create(:user, email: 'googleuser@gmail.com') }

      it 'links the Google account and returns token' do
        expect {
          post '/auth/google', params: { id_token: 'valid-google-token' }
        }.not_to change(User, :count)

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
        expect(json['user']['email']).to eq('googleuser@gmail.com')
        expect(existing_user.reload.google_uid).to eq('google-uid-123')
      end
    end

    context 'with valid token for existing Google user' do
      let!(:google_user) { create(:user, email: 'googleuser@gmail.com', google_uid: 'google-uid-123') }

      it 'returns token without modifying user' do
        expect {
          post '/auth/google', params: { id_token: 'valid-google-token' }
        }.not_to change(User, :count)

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
        expect(json['user']['google_uid']).to eq('google-uid-123')
      end
    end

    context 'with invalid Google token' do
      before do
        allow(HTTParty).to receive(:get)
          .with(/oauth2\.googleapis\.com\/tokeninfo/)
          .and_return(double(success?: false))
      end

      it 'returns unauthorized' do
        post '/auth/google', params: { id_token: 'invalid-token' }

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'without id_token' do
      it 'returns unprocessable entity' do
        post '/auth/google', params: {}

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
