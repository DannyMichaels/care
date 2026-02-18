FactoryBot.define do
  factory :medication do
    name { Faker::Lorem.word }
    time { Time.current }
    reason { Faker::Lorem.sentence }
    user
  end
end
