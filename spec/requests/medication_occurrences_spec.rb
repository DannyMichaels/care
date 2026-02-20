require 'rails_helper'

RSpec.describe 'MedicationOccurrences', type: :request do
  let!(:user) { create(:user) }
  let!(:headers) { auth_headers(user) }
  let!(:medication) { create(:medication, user: user, schedule_unit: 'day', schedule_interval: 1) }

  describe 'GET /medications/:medication_id/occurrences' do
    it 'returns occurrences for a medication' do
      create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-19')
      create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-20')

      get "/medications/#{medication.id}/occurrences", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end

    it 'filters by date range' do
      create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-18')
      create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-19')
      create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-20')

      get "/medications/#{medication.id}/occurrences",
        params: { from: '2026-02-19', to: '2026-02-19' },
        headers: headers

      json = JSON.parse(response.body)
      expect(json.length).to eq(1)
      expect(json[0]['occurrence_date']).to eq('2026-02-19')
    end

    it 'requires authentication' do
      get "/medications/#{medication.id}/occurrences"
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'GET /medication_occurrences (batch)' do
    it 'returns all occurrences for the user in date range' do
      med2 = create(:medication, user: user, schedule_unit: 'week', schedule_interval: 1)
      create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-19')
      create(:medication_occurrence, medication: med2, occurrence_date: '2026-02-19')

      get '/medication_occurrences',
        params: { from: '2026-02-19', to: '2026-02-19' },
        headers: headers

      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end

    it 'does not return other users occurrences' do
      other_user = create(:user)
      other_med = create(:medication, user: other_user, schedule_unit: 'day', schedule_interval: 1)
      create(:medication_occurrence, medication: other_med, occurrence_date: '2026-02-19')
      create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-19')

      get '/medication_occurrences',
        params: { from: '2026-02-19', to: '2026-02-19' },
        headers: headers

      json = JSON.parse(response.body)
      expect(json.length).to eq(1)
      expect(json[0]['medication_id']).to eq(medication.id)
    end
  end

  describe 'POST /medications/:medication_id/occurrences' do
    it 'creates an occurrence (mark taken)' do
      expect {
        post "/medications/#{medication.id}/occurrences",
          params: { occurrence_date: '2026-02-19', is_taken: true, taken_date: Time.current.iso8601 },
          headers: headers
      }.to change(MedicationOccurrence, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['is_taken']).to be true
      expect(json['occurrence_date']).to eq('2026-02-19')
    end

    it 'creates a skipped occurrence' do
      post "/medications/#{medication.id}/occurrences",
        params: { occurrence_date: '2026-02-19', skipped: true },
        headers: headers

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['skipped']).to be true
    end

    it 'rejects duplicate occurrence_date for same medication' do
      create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-19')

      post "/medications/#{medication.id}/occurrences",
        params: { occurrence_date: '2026-02-19', is_taken: true },
        headers: headers

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'PUT /medications/:medication_id/occurrences/:id' do
    let!(:occurrence) { create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-19') }

    it 'updates an occurrence (toggle taken)' do
      put "/medications/#{medication.id}/occurrences/#{occurrence.id}",
        params: { is_taken: true, taken_date: Time.current.iso8601 },
        headers: headers

      expect(response).to have_http_status(:ok)
      expect(occurrence.reload.is_taken).to be true
    end

    it 'can untake an occurrence' do
      occurrence.update!(is_taken: true, taken_date: Time.current)

      put "/medications/#{medication.id}/occurrences/#{occurrence.id}",
        params: { is_taken: false, taken_date: nil },
        headers: headers

      expect(response).to have_http_status(:ok)
      expect(occurrence.reload.is_taken).to be false
      expect(occurrence.taken_date).to be_nil
    end
  end

  describe 'DELETE /medications/:medication_id/occurrences/:id' do
    let!(:occurrence) { create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-19') }

    it 'deletes an occurrence' do
      expect {
        delete "/medications/#{medication.id}/occurrences/#{occurrence.id}", headers: headers
      }.to change(MedicationOccurrence, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end

  describe 'dependent destroy' do
    it 'destroys occurrences when medication is deleted' do
      create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-19')
      create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-20')

      expect {
        medication.destroy
      }.to change(MedicationOccurrence, :count).by(-2)
    end
  end
end
