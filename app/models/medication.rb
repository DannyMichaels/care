class Medication < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates :time, presence: true
  validates :reason, presence: true
end
