FactoryBot.define do
  factory :symptom do
    name { Faker::Lorem.word[0..19] }
    time { Time.current }
    user
  end
end
