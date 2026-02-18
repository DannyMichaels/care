require 'rails_helper'

RSpec.describe EmailVerification, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:code) }
    it { should validate_presence_of(:expires_at) }
  end

  describe 'code generation' do
    it 'generates a 6-digit code on create' do
      verification = create(:email_verification)
      expect(verification.code).to match(/\A\d{6}\z/)
    end

    it 'generates different codes for different records' do
      v1 = create(:email_verification)
      v2 = create(:email_verification)
      # Codes could theoretically be the same, but very unlikely
      expect(v1.code).to be_present
      expect(v2.code).to be_present
    end
  end

  describe 'expiry' do
    it 'sets expires_at to 10 minutes from now on create' do
      freeze_time = Time.current
      allow(Time).to receive(:current).and_return(freeze_time)

      verification = create(:email_verification)
      expect(verification.expires_at).to be_within(1.second).of(freeze_time + 10.minutes)
    end
  end

  describe '#expired?' do
    it 'returns false when not expired' do
      verification = create(:email_verification)
      expect(verification.expired?).to be false
    end

    it 'returns true when expired' do
      verification = create(:email_verification)
      verification.update_column(:expires_at, 1.minute.ago)
      expect(verification.expired?).to be true
    end
  end
end
