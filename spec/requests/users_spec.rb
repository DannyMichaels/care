require 'rails_helper'

RSpec.describe 'Users', type: :request do
  describe 'GET /users' do
    it 'returns all users (public)' do
      create_list(:user, 3)

      get '/users'

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
    end

    it 'excludes password_digest' do
      create(:user)

      get '/users'

      json = JSON.parse(response.body)
      expect(json.first).not_to have_key('password_digest')
    end
  end

  describe 'POST /users' do
    let(:valid_params) do
      {
        user: {
          name: 'Test',
          email: 'newuser@example.com',
          password: 'password123',
          gender: 'Male',
          birthday: '1995-01-01'
        }
      }
    end

    it 'creates a user and returns token' do
      expect {
        post '/users', params: valid_params
      }.to change(User, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['token']).to be_present
      expect(json['user']['email']).to eq('newuser@example.com')
    end

    it 'rejects duplicate email' do
      create(:user, email: 'existing@example.com')

      post '/users', params: {
        user: valid_params[:user].merge(email: 'existing@example.com')
      }

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'PUT /users/:id' do
    let!(:user) { create(:user) }

    it 'updates own profile' do
      put "/users/#{user.id}",
        params: { user: { name: 'Updated Name' } },
        headers: auth_headers(user)

      expect(response).to have_http_status(:ok)
      expect(user.reload.name).to eq('Updated Name')
    end

    it 'rejects unauthorized update' do
      other_user = create(:user)

      put "/users/#{user.id}",
        params: { user: { name: 'Hacked' } },
        headers: auth_headers(other_user)

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'DELETE /users/:id' do
    let!(:user) { create(:user) }

    it 'deletes own account' do
      expect {
        delete "/users/#{user.id}", headers: auth_headers(user)
      }.to change(User, :count).by(-1)
    end
  end
end
