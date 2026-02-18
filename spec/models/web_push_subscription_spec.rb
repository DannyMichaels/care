require 'rails_helper'

RSpec.describe WebPushSubscription, type: :model do
  describe 'validations' do
    subject { build(:web_push_subscription) }

    it { should validate_presence_of(:endpoint) }
    it { should validate_uniqueness_of(:endpoint).scoped_to(:user_id) }
    it { should validate_presence_of(:p256dh) }
    it { should validate_presence_of(:auth) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
  end
end
