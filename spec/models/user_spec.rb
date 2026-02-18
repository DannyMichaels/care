require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    subject { build(:user) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email) }
    it { should validate_presence_of(:gender) }
    it { should validate_length_of(:password).is_at_least(8) }
    it { should allow_value('user@example.com').for(:email) }
    it { should_not allow_value('invalid').for(:email) }
  end

  describe 'associations' do
    it { should have_many(:moods).dependent(:destroy) }
    it { should have_many(:insights).dependent(:destroy) }
    it { should have_many(:affirmations).dependent(:destroy) }
    it { should have_many(:symptoms).dependent(:destroy) }
    it { should have_many(:foods).dependent(:destroy) }
    it { should have_many(:medications).dependent(:destroy) }
    it { should have_many(:likes).dependent(:destroy) }
    it { should have_many(:push_tokens).dependent(:destroy) }
    it { should have_many(:comments) }
  end

  describe '#downcase_email' do
    it 'downcases email before save' do
      user = create(:user, email: 'TEST@EXAMPLE.COM')
      expect(user.reload.email).to eq('test@example.com')
    end
  end

  describe 'has_secure_password' do
    it 'authenticates with correct password' do
      user = create(:user, password: 'password123')
      expect(user.authenticate('password123')).to eq(user)
    end

    it 'rejects incorrect password' do
      user = create(:user, password: 'password123')
      expect(user.authenticate('wrong')).to be_falsey
    end
  end
end
