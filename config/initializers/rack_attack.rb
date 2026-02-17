class Rack::Attack
  # Throttle login attempts: 5 requests per 20 seconds per IP
  throttle("login/ip", limit: 5, period: 20.seconds) do |req|
    req.ip if req.path == "/auth/login" && req.post?
  end

  # Throttle registration: 3 requests per minute per IP
  throttle("registration/ip", limit: 3, period: 1.minute) do |req|
    req.ip if req.path == "/users" && req.post?
  end

  self.throttled_responder = lambda do |req|
    [429, { "Content-Type" => "application/json" }, [{ error: "Rate limit exceeded. Try again later." }.to_json]]
  end
end
