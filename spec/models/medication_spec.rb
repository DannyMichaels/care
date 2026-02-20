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

  describe 'scopes' do
    it '.recurring returns only medications with schedule_unit' do
      recurring = create(:medication, schedule_unit: 'day', schedule_interval: 1)
      create(:medication)

      expect(Medication.recurring).to eq([recurring])
    end
  end

  describe '#recurring?' do
    it 'returns true when schedule_unit is present' do
      med = build(:medication, schedule_unit: 'day', schedule_interval: 1)
      expect(med.recurring?).to be true
    end

    it 'returns false when schedule_unit is nil' do
      med = build(:medication, schedule_unit: nil)
      expect(med.recurring?).to be false
    end
  end

  describe '#occurs_on_date?' do
    let(:start_time) { Time.parse('2026-01-01T09:00:00') }

    context 'daily schedule' do
      let(:med) { create(:medication, time: start_time, schedule_unit: 'day', schedule_interval: 1) }

      it 'occurs on start date' do
        expect(med.occurs_on_date?(Date.parse('2026-01-01'))).to be true
      end

      it 'occurs on the next day' do
        expect(med.occurs_on_date?(Date.parse('2026-01-02'))).to be true
      end

      it 'does not occur before start date' do
        expect(med.occurs_on_date?(Date.parse('2025-12-31'))).to be false
      end
    end

    context 'every-other-day schedule' do
      let(:med) { create(:medication, time: start_time, schedule_unit: 'day', schedule_interval: 2) }

      it 'occurs on start date' do
        expect(med.occurs_on_date?(Date.parse('2026-01-01'))).to be true
      end

      it 'does not occur on odd day' do
        expect(med.occurs_on_date?(Date.parse('2026-01-02'))).to be false
      end

      it 'occurs on even day' do
        expect(med.occurs_on_date?(Date.parse('2026-01-03'))).to be true
      end
    end

    context 'weekly schedule' do
      let(:med) { create(:medication, time: start_time, schedule_unit: 'week', schedule_interval: 1) }

      it 'occurs on start date' do
        expect(med.occurs_on_date?(Date.parse('2026-01-01'))).to be true
      end

      it 'does not occur mid-week' do
        expect(med.occurs_on_date?(Date.parse('2026-01-04'))).to be false
      end

      it 'occurs one week later' do
        expect(med.occurs_on_date?(Date.parse('2026-01-08'))).to be true
      end
    end

    context 'biweekly schedule' do
      let(:med) { create(:medication, time: start_time, schedule_unit: 'week', schedule_interval: 2) }

      it 'occurs on start date' do
        expect(med.occurs_on_date?(Date.parse('2026-01-01'))).to be true
      end

      it 'does not occur after one week' do
        expect(med.occurs_on_date?(Date.parse('2026-01-08'))).to be false
      end

      it 'occurs after two weeks' do
        expect(med.occurs_on_date?(Date.parse('2026-01-15'))).to be true
      end
    end

    context 'monthly schedule' do
      let(:med) { create(:medication, time: start_time, schedule_unit: 'month', schedule_interval: 1) }

      it 'occurs on start date' do
        expect(med.occurs_on_date?(Date.parse('2026-01-01'))).to be true
      end

      it 'does not occur on a different day of month' do
        expect(med.occurs_on_date?(Date.parse('2026-02-02'))).to be false
      end

      it 'occurs one month later on same day' do
        expect(med.occurs_on_date?(Date.parse('2026-02-01'))).to be true
      end
    end

    context 'with schedule_end_date' do
      let(:med) do
        create(:medication,
          time: start_time,
          schedule_unit: 'day',
          schedule_interval: 1,
          schedule_end_date: Date.parse('2026-01-10')
        )
      end

      it 'occurs on end date' do
        expect(med.occurs_on_date?(Date.parse('2026-01-10'))).to be true
      end

      it 'does not occur after end date' do
        expect(med.occurs_on_date?(Date.parse('2026-01-11'))).to be false
      end
    end

    context 'with string date input' do
      let(:med) { create(:medication, time: start_time, schedule_unit: 'day', schedule_interval: 1) }

      it 'accepts string dates' do
        expect(med.occurs_on_date?('2026-01-01')).to be true
      end
    end

    context 'one-time medication' do
      let(:med) { create(:medication, time: start_time, schedule_unit: nil, schedule_interval: nil) }

      it 'returns false' do
        expect(med.occurs_on_date?(Date.parse('2026-01-01'))).to be false
      end
    end
  end

  describe '#occurrence_handled?' do
    let(:med) { create(:medication, schedule_unit: 'day', schedule_interval: 1) }
    let(:date) { Date.parse('2026-01-15') }

    it 'returns false when no occurrence exists' do
      expect(med.occurrence_handled?(date)).to be false
    end

    it 'returns false when occurrence exists but not taken or skipped' do
      create(:medication_occurrence, medication: med, occurrence_date: date, is_taken: false, skipped: false)
      expect(med.occurrence_handled?(date)).to be false
    end

    it 'returns true when occurrence is taken' do
      create(:medication_occurrence, medication: med, occurrence_date: date, is_taken: true)
      expect(med.occurrence_handled?(date)).to be true
    end

    it 'returns true when occurrence is skipped' do
      create(:medication_occurrence, medication: med, occurrence_date: date, skipped: true)
      expect(med.occurrence_handled?(date)).to be true
    end
  end
end
