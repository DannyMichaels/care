class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch('MAILER_FROM', 'onboarding@resend.dev')
  layout 'mailer'
end

