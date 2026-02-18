require 'rails_helper'

RSpec.describe Food, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_length_of(:name).is_at_most(20) }
    it { should validate_presence_of(:time) }
    it { should validate_presence_of(:rating) }
    it { should validate_numericality_of(:rating).only_integer.is_greater_than_or_equal_to(1).is_less_than_or_equal_to(5) }
    it { should validate_presence_of(:factors) }
    it { should validate_length_of(:factors).is_at_most(131) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
  end
end
