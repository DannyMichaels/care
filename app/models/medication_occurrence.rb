class MedicationOccurrence < ApplicationRecord
  belongs_to :medication

  validates :occurrence_date, presence: true,
    uniqueness: { scope: :medication_id }
end
