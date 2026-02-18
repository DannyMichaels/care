require 'rails_helper'

RSpec.describe 'Insights', type: :request do
  let!(:user) { create(:user) }
  let!(:headers) { auth_headers(user) }

  describe 'GET /insights' do
    it 'returns all insights (public)' do
      create_list(:insight, 3, user: user)

      get '/insights'

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
    end

    it 'includes user and comments' do
      insight = create(:insight, user: user)
      create(:comment, insight: insight, user: user)

      get '/insights'

      json = JSON.parse(response.body)
      expect(json.first['user']).to be_present
      expect(json.first['comments']).to be_present
    end
  end

  describe 'GET /insights/:id' do
    it 'returns a single insight (public)' do
      insight = create(:insight, user: user)

      get "/insights/#{insight.id}"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['user']).to be_present
    end
  end

  describe 'POST /insights' do
    let(:valid_params) do
      { insight: { title: 'My insight', description: 'A description', body: 'The body text' } }
    end

    it 'creates an insight' do
      expect {
        post '/insights', params: valid_params, headers: headers
      }.to change(Insight, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it 'requires authentication' do
      post '/insights', params: valid_params
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'DELETE /insights/:id' do
    let!(:insight) { create(:insight, user: user) }

    it 'deletes the insight' do
      expect {
        delete "/insights/#{insight.id}", headers: headers
      }.to change(Insight, :count).by(-1)
    end
  end
end
