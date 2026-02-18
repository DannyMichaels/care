require 'rails_helper'

RSpec.describe PushToken, type: :model do
  describe 'validations' do
    subject { build(:push_token) }

    it { should validate_presence_of(:token) }
    it { should validate_uniqueness_of(:token) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
  end
end
