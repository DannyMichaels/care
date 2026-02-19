require 'ostruct'

class VerificationMailerPreview < ActionMailer::Preview
  def verification_code_email
    verification = OpenStruct.new(code: '482916', email: 'jane@example.com')
    VerificationMailer.verification_code_email(verification)
  end
end
