require 'rails_helper'

RSpec.describe Like, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:insight) }
  end

  describe 'validations' do
    it 'prevents duplicate likes on the same insight by the same user' do
      user = create(:user)
      insight = create(:insight)
      create(:like, user: user, insight: insight)
      duplicate = build(:like, user: user, insight: insight)
      expect(duplicate).not_to be_valid
    end
  end
end
