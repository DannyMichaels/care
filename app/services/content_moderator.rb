class ContentModerator
  def self.check(text)
    return nil if text.blank?
    client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])
    response = client.moderations(parameters: { input: text })
    result = response.dig('results', 0)
    return nil unless result&.dig('flagged')
    flagged_categories = result['categories'].select { |_, v| v }.keys.join(', ')
    "Content flagged for: #{flagged_categories}"
  rescue StandardError
    nil # fail open if API is down
  end
end
