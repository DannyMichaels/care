class ApplicationMailer < ActionMailer::Base
  SUPPORT_EMAIL = 'care.netlify.app@gmail.com'.freeze

  default from: ENV.fetch('MAILER_FROM', 'onboarding@resend.dev')
  layout 'mailer'

  helper_method :support_email

  private

  def support_email
    SUPPORT_EMAIL
  end
end

