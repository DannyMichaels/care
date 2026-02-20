gclass DailyMedicationSchedulerJob < ApplicationJob
  queue_as :scheduled

  def perform
    today = Date.current

    Medication.recurring.find_each do |med|
      next unless med.occurs_on_date?(today)
      next if med.occurrence_handled?(today)

      med_time = med.time
      scheduled_time = Time.current.change(hour: med_time.hour, min: med_time.min, sec: med_time.sec)
      delay = scheduled_time - Time.current

      if delay.positive?
        MedicationNotificationJob.set(wait: delay.seconds).perform_later(med.id, med_time.to_s, today.to_s)
      end
    end

    Rails.logger.info("[DailyScheduler] Processed recurring medications for #{today}")
  end
end
