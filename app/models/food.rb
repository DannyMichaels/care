class Food < ApplicationRecord
  belongs_to :user

  validates :name, presence: true, length: { maximum: 20 }
  validates :time, presence: true
  validates :rating, presence: true, numericality: { only_integer: true, in: 1..5 }
  validates :factors, presence: true, length: { maximum: 131 }
end
