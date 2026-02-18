FactoryBot.define do
  factory :mood do
    status { %w[Poor Okay Good Great].sample }
    time { Time.current }
    reason { Faker::Lorem.sentence }
    user
  end
end
