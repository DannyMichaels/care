require 'rails_helper'

RSpec.describe Medication, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:time) }
    it { should validate_presence_of(:reason) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
  end
end
