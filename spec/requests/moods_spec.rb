require 'rails_helper'

RSpec.describe 'Moods', type: :request do
  let!(:user) { create(:user) }
  let!(:headers) { auth_headers(user) }

  describe 'GET /moods' do
    it 'returns user moods' do
      create_list(:mood, 2, user: user)

      get '/moods', headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end
  end

  describe 'POST /moods' do
    let(:valid_params) do
      { mood: { status: 'Good', time: Time.current.iso8601, reason: 'Feeling great' } }
    end

    it 'creates a mood' do
      expect {
        post '/moods', params: valid_params, headers: headers
      }.to change(Mood, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end

  describe 'PUT /moods/:id' do
    let!(:mood) { create(:mood, user: user) }

    it 'updates the mood' do
      put "/moods/#{mood.id}", params: { mood: { status: 'Great' } }, headers: headers

      expect(response).to have_http_status(:ok)
      expect(mood.reload.status).to eq('Great')
    end
  end

  describe 'DELETE /moods/:id' do
    let!(:mood) { create(:mood, user: user) }

    it 'deletes the mood' do
      expect {
        delete "/moods/#{mood.id}", headers: headers
      }.to change(Mood, :count).by(-1)
    end
  end
end
