class EmailVerification < ApplicationRecord
  CODE_EXPIRY_MINUTES = 10

  validates :email, presence: true
  validates :code, presence: true
  validates :expires_at, presence: true

  before_validation :generate_code, on: :create
  before_validation :set_expiry, on: :create

  def expired?
    expires_at < Time.current
  end

  private

  def generate_code
    self.code = SecureRandom.random_number(10**6).to_s.rjust(6, '0')
  end

  def set_expiry
    self.expires_at = CODE_EXPIRY_MINUTES.minutes.from_now
  end
end
