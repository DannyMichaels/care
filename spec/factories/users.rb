FactoryBot.define do
  factory :user do
    name { Faker::Name.first_name }
    sequence(:email) { |n| "user#{n}@example.com" }
    password { 'password123' }
    gender { %w[Male Female Other].sample }
    birthday { 25.years.ago.to_date }
  end
end
