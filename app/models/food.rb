class Food < ApplicationRecord
  belongs_to :user

  validates :name, presence: true, length: { maximum: 20 }
  validates :time, presence: true
  validates :rating, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }
  validates :factors, presence: true, length: { maximum: 131 }
end
