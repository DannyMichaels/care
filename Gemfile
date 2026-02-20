source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.4.8'

gem 'rails', '~> 7.1.0'
gem 'pg', '>= 0.18', '< 2.0'
gem 'puma', '~> 6.0'
gem 'bcrypt', '~> 3.1.7'
gem 'faker'
gem 'bootsnap', '>= 1.4.2', require: false
gem 'irb', '1.14.3'
gem 'rdoc', '6.14.0'
gem 'rack-cors'
gem 'rack-attack'
gem 'jwt'
gem 'httparty'
gem 'web-push', '1.0.0'
gem 'resend'
gem 'ruby-openai'
gem 'sidekiq', '~> 7.3'
gem 'sidekiq-cron', '~> 2.0'

# Please add the following to your Gemfile to avoid polling for changes
# gem 'wdm', '>= 0.1.0' # this breaks render build tf?

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'dotenv-rails'
  gem 'rspec-rails', '~> 7.0'
  gem 'factory_bot_rails', '~> 6.4'
  gem 'shoulda-matchers', '~> 6.0'
  gem 'database_cleaner-active_record', '~> 2.1'
end

group :development do
  gem 'listen', '~> 3.2'
  gem 'letter_opener'
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
