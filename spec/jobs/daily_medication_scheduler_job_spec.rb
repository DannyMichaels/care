require 'rails_helper'

RSpec.describe DailyMedicationSchedulerJob, type: :job do
  let!(:user) { create(:user) }

  describe '#perform' do
    context 'with a recurring med occurring today' do
      let!(:med) do
        create(:medication,
          user: user,
          time: Time.current.change(hour: 14, min: 0),
          schedule_unit: 'day',
          schedule_interval: 1
        )
      end

      it 'enqueues a MedicationNotificationJob' do
        travel_to Time.current.change(hour: 0, min: 0) do
          expect {
            described_class.new.perform
          }.to have_enqueued_job(MedicationNotificationJob).with(med.id, med.time.to_s, Date.current.to_s)
        end
      end

      it 'creates a ScheduledJob record' do
        travel_to Time.current.change(hour: 0, min: 0) do
          expect {
            described_class.new.perform
          }.to change(ScheduledJob, :count).by_at_least(1)

          record = ScheduledJob.where(job_class: 'MedicationNotificationJob').last
          expect(record).to be_present
          expect(record.arguments).to include(med.id)
        end
      end
    end

    context 'self-rescheduling' do
      it 'creates a pending DailyMedicationSchedulerJob for tomorrow' do
        travel_to Time.current.change(hour: 0, min: 0) do
          described_class.new.perform

          cron_record = ScheduledJob.pending.find_by(job_class: 'DailyMedicationSchedulerJob')
          expect(cron_record).to be_present
          expect(cron_record.run_at).to be_within(1.second).of(Date.tomorrow.beginning_of_day)
        end
      end
    end

    context 'with a one-time medication' do
      let!(:med) { create(:medication, user: user, schedule_unit: nil, schedule_interval: nil) }

      it 'does not enqueue a notification' do
        travel_to Time.current.change(hour: 0, min: 0) do
          expect {
            described_class.new.perform
          }.not_to have_enqueued_job(MedicationNotificationJob)
        end
      end
    end

    context 'with a recurring med already taken today' do
      let!(:med) do
        create(:medication,
          user: user,
          time: Time.current.change(hour: 14, min: 0),
          schedule_unit: 'day',
          schedule_interval: 1
        )
      end

      before do
        create(:medication_occurrence,
          medication: med,
          occurrence_date: Date.current,
          is_taken: true
        )
      end

      it 'does not enqueue a notification' do
        travel_to Time.current.change(hour: 0, min: 0) do
          expect {
            described_class.new.perform
          }.not_to have_enqueued_job(MedicationNotificationJob)
        end
      end
    end

    context 'with a recurring med already skipped today' do
      let!(:med) do
        create(:medication,
          user: user,
          time: Time.current.change(hour: 14, min: 0),
          schedule_unit: 'day',
          schedule_interval: 1
        )
      end

      before do
        create(:medication_occurrence,
          medication: med,
          occurrence_date: Date.current,
          skipped: true
        )
      end

      it 'does not enqueue a notification' do
        travel_to Time.current.change(hour: 0, min: 0) do
          expect {
            described_class.new.perform
          }.not_to have_enqueued_job(MedicationNotificationJob)
        end
      end
    end

    context 'with a recurring med not occurring today' do
      let!(:med) do
        create(:medication,
          user: user,
          time: 1.day.ago.change(hour: 14, min: 0),
          schedule_unit: 'day',
          schedule_interval: 2
        )
      end

      it 'does not enqueue a notification' do
        travel_to Time.current.change(hour: 0, min: 0) do
          expect {
            described_class.new.perform
          }.not_to have_enqueued_job(MedicationNotificationJob)
        end
      end
    end
  end
end
