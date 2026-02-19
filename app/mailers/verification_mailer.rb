class VerificationMailer < ApplicationMailer
  def verification_code_email(verification)
    @code = verification.code
    @email = verification.email
    @expiry_minutes = EmailVerification::CODE_EXPIRY_MINUTES
    mail(to: @email, subject: "Your Care verification code: #{@code}")
  end
end
