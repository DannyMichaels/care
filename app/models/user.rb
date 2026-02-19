class User < ApplicationRecord
  has_secure_password

  validates :name, presence: true, uniqueness: false
  validates :email, presence: true, uniqueness: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, allow_nil: true
  validates :gender, presence: true, uniqueness: false
  before_save :downcase_email

  has_many :moods, dependent: :destroy
  has_many :insights, dependent: :destroy
  has_many :affirmations, dependent: :destroy
  has_many :symptoms, dependent: :destroy
  has_many :foods, dependent: :destroy
  has_many :medications, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :push_tokens, dependent: :destroy
  has_many :web_push_subscriptions, dependent: :destroy
  has_many :liked_insights, through: :likes, source: :insight
  has_many :comments, dependent: :destroy
  has_many :reports, dependent: :destroy
  has_many :blocks_as_blocker, class_name: 'Block', foreign_key: :blocker_id, dependent: :destroy
  has_many :blocks_as_blocked, class_name: 'Block', foreign_key: :blocked_id, dependent: :destroy
  has_many :blocked_users, through: :blocks_as_blocker, source: :blocked
  
  def downcase_email
    self.email.downcase!
  end

end

