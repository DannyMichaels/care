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

  describe 'POST /medications (with schedule)' do
    it 'creates a scheduled medication' do
      params = {
        medication: {
          name: 'Humira',
          time: Time.current.iso8601,
          reason: 'Autoimmune',
          schedule_unit: 'week',
          schedule_interval: 2,
        }
      }

      post '/medications', params: params, headers: headers

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['schedule_unit']).to eq('week')
      expect(json['schedule_interval']).to eq(2)
    end

    it 'creates a scheduled medication with end date' do
      params = {
        medication: {
          name: 'Prednisone',
          time: Time.current.iso8601,
          reason: 'Short course',
          schedule_unit: 'day',
          schedule_interval: 1,
          schedule_end_date: '2026-03-19',
        }
      }

      post '/medications', params: params, headers: headers

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['schedule_end_date']).to eq('2026-03-19')
    end

    it 'rejects invalid schedule_unit' do
      params = {
        medication: {
          name: 'Test',
          time: Time.current.iso8601,
          reason: 'Test',
          schedule_unit: 'year',
          schedule_interval: 1,
        }
      }

      post '/medications', params: params, headers: headers

      expect(response).to have_http_status(:unprocessable_entity)
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
