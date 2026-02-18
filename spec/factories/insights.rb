FactoryBot.define do
  factory :insight do
    title { Faker::Lorem.sentence(word_count: 3)[0..49] }
    description { Faker::Lorem.sentence }
    body { Faker::Lorem.paragraph }
    user
  end
end
