FactoryBot.define do
  factory :affirmation do
    content { Faker::Lorem.sentence }
    user
  end
end
