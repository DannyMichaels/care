require 'rails_helper'

RSpec.describe 'Medications Dashboard', type: :request do
  let!(:user) { create(:user) }
  let!(:headers) { auth_headers(user) }
  let(:today) { '2026-02-20' }

  let!(:one_time_med) do
    create(:medication, user: user, name: 'Ibuprofen',
      time: Time.parse("#{today}T09:00:00"), reason: 'Headache')
  end

  let!(:scheduled_med) do
    create(:medication, user: user, name: 'Humira',
      time: Time.parse("#{today}T08:00:00"), reason: 'Autoimmune',
      schedule_unit: 'week', schedule_interval: 2)
  end

  describe 'GET /medications/dashboard' do
    it 'requires authentication' do
      get '/medications/dashboard'
      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns all user medications with occurrence merged inline' do
      occ = create(:medication_occurrence,
        medication: scheduled_med, occurrence_date: today,
        is_taken: true, taken_date: Time.current)

      get "/medications/dashboard?date=#{today}", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)

      humira = json.find { |m| m['name'] == 'Humira' }
      expect(humira['occurrence']).to be_present
      expect(humira['occurrence']['is_taken']).to be true
      expect(humira['occurrence']['id']).to eq(occ.id)
    end

    it 'returns null occurrence for one-time meds' do
      get "/medications/dashboard?date=#{today}", headers: headers

      json = JSON.parse(response.body)
      ibuprofen = json.find { |m| m['name'] == 'Ibuprofen' }
      expect(ibuprofen['occurrence']).to be_nil
    end

    it 'returns null occurrence for scheduled meds with no record on that date' do
      get "/medications/dashboard?date=#{today}", headers: headers

      json = JSON.parse(response.body)
      humira = json.find { |m| m['name'] == 'Humira' }
      expect(humira['occurrence']).to be_nil
    end

    it 'returns empty occurrences when no date param is provided' do
      create(:medication_occurrence,
        medication: scheduled_med, occurrence_date: today,
        is_taken: true, taken_date: Time.current)

      get '/medications/dashboard', headers: headers

      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
      json.each { |m| expect(m['occurrence']).to be_nil }
    end

    it 'does not return medications from other users' do
      other_user = create(:user, email: 'other@example.com')
      create(:medication, user: other_user, name: 'OtherMed',
        time: Time.current, reason: 'Other')

      get "/medications/dashboard?date=#{today}", headers: headers

      json = JSON.parse(response.body)
      expect(json.map { |m| m['name'] }).not_to include('OtherMed')
    end
  end
end
