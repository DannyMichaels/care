class Medication < ApplicationRecord
  belongs_to :user
  has_many :medication_occurrences, dependent: :destroy

  validates :name, presence: true
  validates :time, presence: true
  validates :reason, presence: true
  validates :schedule_unit, inclusion: { in: %w[day week month], allow_nil: true }
  validates :schedule_interval, presence: true, if: -> { schedule_unit.present? }
  validates :schedule_unit, presence: true, if: -> { schedule_interval.present? }
  validates :schedule_interval, numericality: { only_integer: true, greater_than: 0, less_than: 100 }, allow_nil: true
end
