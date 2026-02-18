require 'rails_helper'

RSpec.describe 'Medications', type: :request do
  let!(:user) { create(:user) }
  let!(:headers) { auth_headers(user) }

  describe 'GET /medications' do
    it 'returns user medications' do
      create_list(:medication, 3, user: user)

      get '/medications', headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
    end

    it 'requires authentication' do
      get '/medications'
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'POST /medications' do
    let(:valid_params) do
      { medication: { name: 'Aspirin', time: Time.current.iso8601, reason: 'Headache' } }
    end

    it 'creates a medication' do
      expect {
        post '/medications', params: valid_params, headers: headers
      }.to change(Medication, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it 'returns errors for invalid params' do
      post '/medications', params: { medication: { name: '' } }, headers: headers

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'PUT /medications/:id' do
    let!(:medication) { create(:medication, user: user) }

    it 'updates the medication' do
      put "/medications/#{medication.id}", params: { medication: { name: 'Updated' } }, headers: headers

      expect(response).to have_http_status(:ok)
      expect(medication.reload.name).to eq('Updated')
    end
  end

  describe 'PUT /medications/:id (mark as taken)' do
    let!(:medication) { create(:medication, user: user) }

    it 'marks medication as taken' do
      put "/medications/#{medication.id}",
        params: { medication: { is_taken: true, taken_date: Time.current.iso8601 } },
        headers: headers

      expect(response).to have_http_status(:ok)
      medication.reload
      expect(medication.is_taken).to be true
      expect(medication.taken_date).to be_present
    end

    it 'does not clear other fields when marking as taken' do
      original_name = medication.name
      put "/medications/#{medication.id}",
        params: { medication: { is_taken: true } },
        headers: headers

      expect(medication.reload.name).to eq(original_name)
    end
  end

  describe 'DELETE /medications/:id' do
    let!(:medication) { create(:medication, user: user) }

    it 'deletes the medication' do
      expect {
        delete "/medications/#{medication.id}", headers: headers
      }.to change(Medication, :count).by(-1)
    end
  end
end
