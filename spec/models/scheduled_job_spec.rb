require 'rails_helper'

RSpec.describe ScheduledJob, type: :model do
  describe '.pending' do
    it 'returns only incomplete jobs' do
      pending_job = ScheduledJob.create!(job_class: 'MedicationNotificationJob', arguments: [1], run_at: 1.hour.from_now)
      ScheduledJob.create!(job_class: 'MedicationNotificationJob', arguments: [2], run_at: 1.hour.ago, completed: true)

      expect(ScheduledJob.pending).to eq([pending_job])
    end
  end

  describe '.enqueue' do
    it 'creates a record and enqueues the job' do
      run_at = 1.hour.from_now

      expect {
        ScheduledJob.enqueue('MedicationNotificationJob', [1, 'time', 'date'], run_at: run_at)
      }.to change(ScheduledJob, :count).by(1)
         .and have_enqueued_job(MedicationNotificationJob).with(1, 'time', 'date')

      record = ScheduledJob.last
      expect(record.job_class).to eq('MedicationNotificationJob')
      expect(record.arguments).to eq([1, 'time', 'date'])
      expect(record.run_at).to be_within(1.second).of(run_at)
      expect(record.completed).to eq(false)
    end
  end

  describe '.enqueue_cron' do
    it 'creates a record when none pending' do
      run_at = 1.day.from_now

      expect {
        ScheduledJob.enqueue_cron('DailyMedicationSchedulerJob', run_at: run_at)
      }.to change(ScheduledJob, :count).by(1)
         .and have_enqueued_job(DailyMedicationSchedulerJob)
    end

    it 'does not duplicate when one is already pending' do
      ScheduledJob.create!(job_class: 'DailyMedicationSchedulerJob', arguments: [], run_at: 1.day.from_now)

      expect {
        ScheduledJob.enqueue_cron('DailyMedicationSchedulerJob', run_at: 2.days.from_now)
      }.not_to change(ScheduledJob, :count)
    end
  end

  describe '#complete!' do
    it 'marks the job as completed' do
      job = ScheduledJob.create!(job_class: 'MedicationNotificationJob', arguments: [1], run_at: Time.current)
      job.complete!
      expect(job.reload.completed).to eq(true)
    end
  end
end
