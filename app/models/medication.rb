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

  scope :recurring, -> { where.not(schedule_unit: nil) }

  def recurring?
    schedule_unit.present?
  end

  def occurs_on_date?(date)
    date = Date.parse(date.to_s) unless date.is_a?(Date)
    return false unless recurring? && time.present?

    start_date = time.to_date
    return false if date < start_date
    return false if schedule_end_date.present? && date > schedule_end_date

    days_diff = (date - start_date).to_i

    case schedule_unit
    when 'day'
      days_diff % schedule_interval == 0
    when 'week'
      days_diff % (schedule_interval * 7) == 0
    when 'month'
      return false unless date.day == start_date.day

      month_diff = (date.year - start_date.year) * 12 + (date.month - start_date.month)
      month_diff >= 0 && month_diff % schedule_interval == 0
    else
      false
    end
  end

  def occurrence_handled?(date)
    date = Date.parse(date.to_s) unless date.is_a?(Date)
    occ = medication_occurrences.find_by(occurrence_date: date)
    return false unless occ

    occ.is_taken || occ.skipped
  end
end
