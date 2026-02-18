require 'rails_helper'

RSpec.describe 'Affirmations', type: :request do
  let!(:user) { create(:user) }
  let!(:headers) { auth_headers(user) }

  describe 'GET /affirmations' do
    it 'returns user affirmations' do
      create_list(:affirmation, 2, user: user)

      get '/affirmations', headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end
  end

  describe 'POST /affirmations' do
    let(:valid_params) do
      { affirmation: { content: 'I am doing my best' } }
    end

    it 'creates an affirmation' do
      expect {
        post '/affirmations', params: valid_params, headers: headers
      }.to change(Affirmation, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end

  describe 'DELETE /affirmations/:id' do
    let!(:affirmation) { create(:affirmation, user: user) }

    it 'deletes the affirmation' do
      expect {
        delete "/affirmations/#{affirmation.id}", headers: headers
      }.to change(Affirmation, :count).by(-1)
    end
  end
end
