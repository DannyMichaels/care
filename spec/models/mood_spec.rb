require 'rails_helper'

RSpec.describe Mood, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:status) }
    it { should validate_inclusion_of(:status).in_array(%w[Poor Okay Good Great]) }
    it { should validate_presence_of(:time) }
    it { should validate_presence_of(:reason) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
  end
end
