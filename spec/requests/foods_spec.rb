require 'rails_helper'

RSpec.describe 'Foods', type: :request do
  let!(:user) { create(:user) }
  let!(:headers) { auth_headers(user) }

  describe 'GET /foods' do
    it 'returns user foods' do
      create_list(:food, 2, user: user)

      get '/foods', headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end
  end

  describe 'POST /foods' do
    let(:valid_params) do
      { food: { name: 'Salad', time: Time.current.iso8601, rating: 4, factors: 'Fresh vegetables' } }
    end

    it 'creates a food' do
      expect {
        post '/foods', params: valid_params, headers: headers
      }.to change(Food, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end

  describe 'DELETE /foods/:id' do
    let!(:food) { create(:food, user: user) }

    it 'deletes the food' do
      expect {
        delete "/foods/#{food.id}", headers: headers
      }.to change(Food, :count).by(-1)
    end
  end
end
