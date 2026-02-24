class ApplicationJob < ActiveJob::Base
  # Automatically retry jobs that encountered a deadlock
  # retry_on ActiveRecord::Deadlocked

  # Most jobs are safe to ignore if the underlying records are no longer available
  # discard_on ActiveJob::DeserializationError

  after_perform do
    ScheduledJob.where(job_class: self.class.name, completed: false)
                .where('run_at <= ?', Time.current)
                .update_all(completed: true)
  end
end
