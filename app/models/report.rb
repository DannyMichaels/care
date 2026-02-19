class Report < ApplicationRecord
  belongs_to :user
  belongs_to :insight

  validates :reason, presence: true
  validates :insight_id, uniqueness: { scope: :user_id }
  validates :status, inclusion: { in: %w[pending reviewed dismissed] }

  scope :pending, -> { where(status: 'pending') }
  scope :reviewed, -> { where(status: 'reviewed') }
  scope :dismissed, -> { where(status: 'dismissed') }
end
