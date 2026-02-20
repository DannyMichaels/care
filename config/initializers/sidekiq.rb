Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0') }

  config.on(:startup) do
    Sidekiq::Cron::Job.create(
      name: 'DailyMedicationScheduler',
      cron: '0 4 * * *',
      class: 'DailyMedicationSchedulerJob'
    )
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0') }
end
