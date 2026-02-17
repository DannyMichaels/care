class Mood < ApplicationRecord
  belongs_to :user

  validates :status, presence: true, inclusion: { in: %w[Poor Okay Good Great] }
  validates :time, presence: true
  validates :reason, presence: true
end
