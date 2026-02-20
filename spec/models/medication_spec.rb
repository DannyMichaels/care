require 'rails_helper'

RSpec.describe Medication, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:time) }
    it { should validate_presence_of(:reason) }
    it { should validate_inclusion_of(:schedule_unit).in_array(%w[day week month]).allow_nil }

    context 'schedule fields' do
      it 'requires schedule_interval when schedule_unit is present' do
        med = build(:medication, schedule_unit: 'day', schedule_interval: nil)
        expect(med).not_to be_valid
        expect(med.errors[:schedule_interval]).to be_present
      end

      it 'requires schedule_unit when schedule_interval is present' do
        med = build(:medication, schedule_unit: nil, schedule_interval: 2)
        expect(med).not_to be_valid
        expect(med.errors[:schedule_unit]).to be_present
      end

      it 'is valid with both schedule_unit and schedule_interval' do
        med = build(:medication, schedule_unit: 'week', schedule_interval: 2)
        expect(med).to be_valid
      end

      it 'is valid without schedule fields (one-time med)' do
        med = build(:medication, schedule_unit: nil, schedule_interval: nil)
        expect(med).to be_valid
      end

      it 'rejects schedule_interval less than 1' do
        med = build(:medication, schedule_unit: 'day', schedule_interval: 0)
        expect(med).not_to be_valid
      end

      it 'rejects schedule_interval greater than 99' do
        med = build(:medication, schedule_unit: 'day', schedule_interval: 100)
        expect(med).not_to be_valid
      end
    end
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:medication_occurrences).dependent(:destroy) }
  end
end
