class AuthenticationController < ApplicationController
  before_action :authorize_request, except: [:login, :reset_password]

  # POST /auth/login
  def login
    email = login_params[:email]
    password = login_params[:password]

    if email == "" || password == "" || email == nil || password == nil
       render json: {
        errors: 'unauthorized',
        message: 'Invalid email or password',
      }, status: :unauthorized
      return;
    end 

    @user = User.find_by(email: email)
    
    if (!@user)
      render json: {
        errors: 'unauthorized',
        message: 'Invalid email or password',
      }, status: :unauthorized
      return
    end

    if @user.authenticate(login_params[:password]) #authenticate method provided by Bcrypt and 'has_secure_password'
      token = encode({id: @user.id})
      render json: {
        user: @user.attributes.except("password_digest"),
        token: token
        }, status: :ok
    else
      render json: { 
        errors: 'unauthorized', 
        message: 'Invalid email or password'
        }, status: :unauthorized
    end
  end
  
  # GET /auth/verify
  def verify
    expires_now
    render json: @current_user.attributes.except("password_digest"), status: :ok
  end


  # POST /auth/reset_password
  def reset_password
    email = params[:email]&.downcase
    code = params[:code]
    new_password = params[:new_password]

    unless email.present? && code.present? && new_password.present?
      return render json: { error: 'Email, code, and new password are required' }, status: :unprocessable_entity
    end

    verification = EmailVerification.find_by(email: email, code: code, verified: false)

    if verification.nil?
      return render json: { error: 'Invalid verification code' }, status: :unprocessable_entity
    end

    if verification.expired?
      return render json: { error: 'Verification code has expired' }, status: :unprocessable_entity
    end

    user = User.find_by(email: email)

    unless user
      return render json: { error: 'User not found' }, status: :not_found
    end

    if user.update(password: new_password)
      verification.update(verified: true)
      render json: { message: 'Password reset successfully' }, status: :ok
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def login_params
    params.require(:authentication).permit(:email, :password)
  end
end
