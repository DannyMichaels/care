class EmailVerificationsController < ApplicationController
  # POST /email_verifications
  def create
    email = params[:email]&.downcase

    unless email.present?
      return render json: { error: 'Email is required' }, status: :unprocessable_entity
    end

    # Delete any existing codes for this email
    EmailVerification.where(email: email).destroy_all

    @verification = EmailVerification.new(email: email)

    if @verification.save
      VerificationMailer.verification_code_email(@verification).deliver_later
      render json: { message: 'Verification code sent' }, status: :created
    else
      render json: @verification.errors, status: :unprocessable_entity
    end
  end

  # POST /email_verifications/verify
  def verify
    email = params[:email]&.downcase
    code = params[:code]

    @verification = EmailVerification.find_by(email: email, code: code, verified: false)

    if @verification.nil?
      return render json: { error: 'Invalid verification code' }, status: :unprocessable_entity
    end

    if @verification.expired?
      return render json: { error: 'Verification code has expired' }, status: :unprocessable_entity
    end

    @verification.update(verified: true)

    user = User.find_by(email: email)
    user&.update(email_verified: true)

    render json: { message: 'Email verified successfully' }, status: :ok
  end
end
