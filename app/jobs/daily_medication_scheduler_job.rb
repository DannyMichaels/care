class DailyMedicationSchedulerJob < ApplicationJob
  queue_as :scheduled

  def perform
    today = Date.current

    Medication.recurring.find_each do |med|
      next unless med.occurs_on_date?(today)
      next if med.occurrence_handled?(today)

      med_time = med.time
      scheduled_time = Time.current.change(hour: med_time.hour, min: med_time.min, sec: med_time.sec)

      if scheduled_time > Time.current
        ScheduledJob.enqueue(
          'MedicationNotificationJob',
          [med.id, med_time.to_s, today.to_s],
          run_at: scheduled_time
        )
      end
    end

    # Self-reschedule for tomorrow at 4 AM
    ScheduledJob.enqueue_cron(
      'DailyMedicationSchedulerJob',
      run_at: Date.tomorrow.beginning_of_day.change(hour: 4)
    )

    Rails.logger.info("[DailyScheduler] Processed recurring medications for #{today}")
  end
end
