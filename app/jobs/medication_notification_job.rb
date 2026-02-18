class MedicationNotificationJob < ApplicationJob
  queue_as :notifications

  def perform(medication_id, expected_time = nil)
    medication = Medication.find_by(id: medication_id)
    return unless medication
    return if medication.is_taken

    # If the med time was changed after this job was scheduled, skip it
    if expected_time.present? && medication.time.present?
      return if medication.time.to_s != expected_time.to_s
    end

    user = medication.user
    send_expo_push(user, medication)
    send_web_push(user, medication)
  end

  private

  def send_expo_push(user, medication)
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

  def send_web_push(user, medication)
    subscriptions = user.web_push_subscriptions
    return if subscriptions.empty?

    payload = {
      title: 'Medication Reminder',
      body: "Time to take #{medication.name}!",
      icon: '/android-chrome-192x192.png',
      data: { url: '/', medication_id: medication.id }
    }.to_json

    subscriptions.find_each do |sub|
      WebPush.payload_send(
        message: payload,
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth,
        vapid: {
          subject: ENV['VAPID_SUBJECT'],
          public_key: ENV['VAPID_PUBLIC_KEY'],
          private_key: ENV['VAPID_PRIVATE_KEY'],
          expiration: 12 * 60 * 60
        }
      )
    rescue WebPush::ExpiredSubscription, WebPush::InvalidSubscription
      sub.destroy
    rescue StandardError => e
      Rails.logger.error("Web push failed for subscription #{sub.id}: #{e.class} - #{e.message}")
      Rails.logger.error(e.backtrace.first(5).join("\n"))
    end
  end
end
