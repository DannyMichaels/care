class MedicationNotificationJob < ApplicationJob
  queue_as :notifications

  def perform(medication_id)
    medication = Medication.find_by(id: medication_id)
    return unless medication
    return if medication.is_taken

    user = medication.user
    tokens = user.push_tokens.pluck(:token)
    return if tokens.empty?

    messages = tokens.map do |token|
      {
        to: token,
        sound: 'default',
        title: 'Medication Reminder',
        body: "Time to take #{medication.name}!",
        data: { medication_id: medication.id }
      }
    end

    HTTParty.post(
      'https://exp.host/--/api/v2/push/send',
      body: messages.to_json,
      headers: {
        'Accept' => 'application/json',
        'Content-Type' => 'application/json'
      }
    )
  end
end
