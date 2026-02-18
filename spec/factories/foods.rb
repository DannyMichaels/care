FactoryBot.define do
  factory :food do
    name { Faker::Food.dish[0..19] }
    time { Time.current }
    rating { rand(1..5) }
    factors { Faker::Lorem.sentence[0..130] }
    user
  end
end
