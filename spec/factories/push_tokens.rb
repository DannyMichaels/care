FactoryBot.define do
  factory :push_token do
    sequence(:token) { |n| "ExponentPushToken[token#{n}]" }
    platform { 'android' }
    user
  end
end
