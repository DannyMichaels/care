require 'rails_helper'

RSpec.describe 'Medication Schedule Conversion', type: :request do
  let!(:user) { create(:user) }
  let!(:headers) { auth_headers(user) }

  describe 'PUT /medications/:id (recurring -> one-time conversion)' do
    let!(:medication) do
      create(:medication, user: user, schedule_unit: 'day', schedule_interval: 1,
             time: Time.parse('2026-02-17T09:00:00'))
    end

    context 'when converting scheduled med to one-time' do
      it 'rewrites time date portion to conversion_date' do
        put "/medications/#{medication.id}",
          params: {
            medication: { schedule_unit: nil, schedule_interval: nil, time: '2026-02-17T09:00:00Z' },
            conversion_date: '2026-02-19'
          },
          headers: headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['time']).to include('2026-02-19')
        expect(json['schedule_unit']).to be_nil
      end

      it 'transfers taken status from occurrence on conversion_date' do
        create(:medication_occurrence, medication: medication,
               occurrence_date: '2026-02-19', is_taken: true,
               taken_date: Time.parse('2026-02-19T10:00:00'))

        put "/medications/#{medication.id}",
          params: {
            medication: { schedule_unit: nil, schedule_interval: nil },
            conversion_date: '2026-02-19',
            occurrence_action: 'keep'
          },
          headers: headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['is_taken']).to be true
        expect(json['taken_date']).to be_present
      end

      it 'does not transfer taken status when no occurrence exists' do
        put "/medications/#{medication.id}",
          params: {
            medication: { schedule_unit: nil, schedule_interval: nil },
            conversion_date: '2026-02-19',
            occurrence_action: 'keep'
          },
          headers: headers

        json = JSON.parse(response.body)
        expect(json['is_taken']).to be_falsy
      end
    end

    context 'occurrence_action: keep' do
      it 'preserves all occurrence records' do
        create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-17', is_taken: true, taken_date: Time.current)
        create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-18', is_taken: true, taken_date: Time.current)
        create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-19')

        expect {
          put "/medications/#{medication.id}",
            params: {
              medication: { schedule_unit: nil, schedule_interval: nil },
              conversion_date: '2026-02-19',
              occurrence_action: 'keep'
            },
            headers: headers
        }.not_to change(MedicationOccurrence, :count)
      end
    end

    context 'occurrence_action: delete_all' do
      it 'destroys all occurrence records' do
        create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-17', is_taken: true, taken_date: Time.current)
        create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-18')

        expect {
          put "/medications/#{medication.id}",
            params: {
              medication: { schedule_unit: nil, schedule_interval: nil },
              conversion_date: '2026-02-19',
              occurrence_action: 'delete_all'
            },
            headers: headers
        }.to change(MedicationOccurrence, :count).by(-2)
      end
    end

    context 'without conversion_date' do
      it 'does not rewrite time or touch occurrences' do
        occ = create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-17')

        put "/medications/#{medication.id}",
          params: { medication: { schedule_unit: nil, schedule_interval: nil } },
          headers: headers

        expect(response).to have_http_status(:ok)
        expect(MedicationOccurrence.exists?(occ.id)).to be true
      end
    end

    context 'when not converting (still scheduled)' do
      it 'does not trigger conversion logic' do
        create(:medication_occurrence, medication: medication, occurrence_date: '2026-02-17')

        expect {
          put "/medications/#{medication.id}",
            params: {
              medication: { schedule_unit: 'week', schedule_interval: 1 },
              conversion_date: '2026-02-19',
              occurrence_action: 'delete_all'
            },
            headers: headers
        }.not_to change(MedicationOccurrence, :count)
      end
    end
  end

  describe 'PUT /medications/:id (skipped flag)' do
    let!(:medication) { create(:medication, user: user) }

    it 'marks a one-time medication as skipped' do
      put "/medications/#{medication.id}",
        params: { medication: { skipped: true } },
        headers: headers

      expect(response).to have_http_status(:ok)
      expect(medication.reload.skipped).to be true
    end

    it 'unskips a one-time medication' do
      medication.update!(skipped: true)

      put "/medications/#{medication.id}",
        params: { medication: { skipped: false } },
        headers: headers

      expect(response).to have_http_status(:ok)
      expect(medication.reload.skipped).to be false
    end

    it 'defaults skipped to false' do
      expect(medication.skipped).to be false
    end
  end
end
