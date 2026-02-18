require 'rails_helper'

RSpec.describe 'Symptoms', type: :request do
  let!(:user) { create(:user) }
  let!(:headers) { auth_headers(user) }

  describe 'GET /symptoms' do
    it 'returns user symptoms' do
      create_list(:symptom, 2, user: user)

      get '/symptoms', headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end
  end

  describe 'POST /symptoms' do
    let(:valid_params) do
      { symptom: { name: 'Headache', time: Time.current.iso8601 } }
    end

    it 'creates a symptom' do
      expect {
        post '/symptoms', params: valid_params, headers: headers
      }.to change(Symptom, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end

  describe 'DELETE /symptoms/:id' do
    let!(:symptom) { create(:symptom, user: user) }

    it 'deletes the symptom' do
      expect {
        delete "/symptoms/#{symptom.id}", headers: headers
      }.to change(Symptom, :count).by(-1)
    end
  end
end
