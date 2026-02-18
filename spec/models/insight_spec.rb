require 'rails_helper'

RSpec.describe Insight, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:body) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:likes).dependent(:destroy) }
    it { should have_many(:comments).dependent(:destroy) }
  end

  describe '#capitalize_title' do
    it 'capitalizes title before save' do
      insight = create(:insight, title: 'my insight title')
      expect(insight.title).to eq('My insight title')
    end
  end

  describe '.newest_first' do
    it 'orders by created_at desc' do
      user = create(:user)
      old = create(:insight, user: user, created_at: 2.days.ago)
      recent = create(:insight, user: user, created_at: 1.day.ago)
      expect(Insight.newest_first).to eq([recent, old])
    end
  end
end
