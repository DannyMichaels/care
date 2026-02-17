class Symptom < ApplicationRecord
  belongs_to :user

  validates :name, presence: true, length: { maximum: 32 }
  validates :time, presence: true
end
