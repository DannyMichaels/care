FactoryBot.define do
  factory :medication_occurrence do
    medication
    occurrence_date { Date.current }
    is_taken { false }
    taken_date { nil }
    skipped { false }
  end
end
