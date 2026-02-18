class VerificationMailer < ApplicationMailer
  def verification_code_email(verification)
    @code = verification.code
    @email = verification.email
    mail(to: @email, subject: "Your Care verification code: #{@code}")
  end
end
