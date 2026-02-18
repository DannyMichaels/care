module AuthHelpers
  def auth_headers(user)
    token = JWT.encode({ id: user.id, exp: 24.hours.from_now.to_i }, Rails.application.secret_key_base.to_s)
    { 'Authorization' => "Bearer #{token}" }
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :request
end
