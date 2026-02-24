Rails.application.config.after_initialize do
  next unless ActiveRecord::Base.connection.table_exists?(:scheduled_jobs)

  # Re-enqueue pending jobs that survived a restart
  ScheduledJob.pending.find_each do |job|
    delay = job.run_at - Time.current

    if delay.positive?
      job.job_class.constantize.set(wait: delay.seconds).perform_later(*job.arguments)
    elsif delay > -1.hour
      # Overdue by less than 1 hour — run now
      job.job_class.constantize.perform_later(*job.arguments)
    else
      # Too old, mark stale
      job.complete!
    end
  end

  # Ensure a DailyMedicationSchedulerJob is always queued
  ScheduledJob.enqueue_cron(
    'DailyMedicationSchedulerJob',
    run_at: Date.tomorrow.beginning_of_day
  )

  # Clean up completed jobs older than 7 days
  ScheduledJob.where(completed: true).where('created_at < ?', 7.days.ago).delete_all
rescue ActiveRecord::NoDatabaseError, ActiveRecord::StatementInvalid
  # Skip during db:create / db:migrate
end
