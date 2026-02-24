class ScheduledJob < ApplicationRecord
  scope :pending, -> { where(completed: false) }

  def self.enqueue(job_class, args, run_at:)
    record = create!(job_class: job_class, arguments: args, run_at: run_at)
    delay = [run_at - Time.current, 0].max
    job_class.constantize.set(wait: delay.seconds).perform_later(*args)
    record
  end

  def self.enqueue_cron(job_class, run_at:)
    return if pending.where(job_class: job_class).exists?

    record = create!(job_class: job_class, arguments: [], run_at: run_at)
    delay = [run_at - Time.current, 0].max
    job_class.constantize.set(wait: delay.seconds).perform_later
    record
  end

  def complete!
    update!(completed: true)
  end
end
