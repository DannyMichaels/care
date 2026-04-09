Rails.application.config.after_initialize do
  next unless ActiveRecord::Base.connection.table_exists?(:scheduled_jobs)

  # Re-enqueue pending jobs that survived a restart
  ScheduledJob.pending.find_each do |job|
    delay = job.run_at - Time.current

    if delay.positive?
      job.job_class.constantize.set(wait: delay.seconds).perform_later(*job.arguments)
    else
      # Overdue — run now regardless of how old
      job.job_class.constantize.perform_later(*job.arguments)
    end
  end

  # Ensure a DailyMedicationSchedulerJob is always queued
  unless ScheduledJob.pending.where(job_class: 'DailyMedicationSchedulerJob').exists?
    ScheduledJob.enqueue_cron(
      'DailyMedicationSchedulerJob',
      run_at: Date.tomorrow.beginning_of_day
    )
  end

  # Clean up completed jobs older than 7 days
  ScheduledJob.where(completed: true).where('created_at < ?', 7.days.ago).delete_all
rescue ActiveRecord::NoDatabaseError, ActiveRecord::StatementInvalid
  # Skip during db:create / db:migrate
end
