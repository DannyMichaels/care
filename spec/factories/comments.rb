FactoryBot.define do
  factory :comment do
    content { Faker::Lorem.sentence }
    user
    insight
  end
end
