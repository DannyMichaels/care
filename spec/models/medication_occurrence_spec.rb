require 'rails_helper'

RSpec.describe MedicationOccurrence, type: :model do
  describe 'validations' do
    subject { build(:medication_occurrence) }

    it { should validate_presence_of(:occurrence_date) }

    it 'validates uniqueness of occurrence_date scoped to medication_id' do
      occurrence = create(:medication_occurrence)
      duplicate = build(:medication_occurrence,
        medication: occurrence.medication,
        occurrence_date: occurrence.occurrence_date
      )
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:occurrence_date]).to be_present
    end

    it 'allows same date for different medications' do
      occurrence = create(:medication_occurrence)
      other_med = create(:medication)
      other = build(:medication_occurrence,
        medication: other_med,
        occurrence_date: occurrence.occurrence_date
      )
      expect(other).to be_valid
    end
  end

  describe 'associations' do
    it { should belong_to(:medication) }
  end

  describe 'defaults' do
    it 'defaults is_taken to false' do
      occurrence = MedicationOccurrence.new
      expect(occurrence.is_taken).to eq(false)
    end

    it 'defaults skipped to false' do
      occurrence = MedicationOccurrence.new
      expect(occurrence.skipped).to eq(false)
    end
  end
end
