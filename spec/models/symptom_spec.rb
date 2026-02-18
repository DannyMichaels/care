require 'rails_helper'

RSpec.describe Symptom, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_length_of(:name).is_at_most(32) }
    it { should validate_presence_of(:time) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
  end
end
