class ApplicationController < ActionController::API
  SECRET_KEY = Rails.application.secret_key_base.to_s

  def encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  def decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new decoded
  end

  def authorize_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    begin
      @decoded = decode(token)
      @current_user = User.find(@decoded[:id])
      unless @current_user.email_verified?
        render json: { error: 'Email not verified', email: @current_user.email }, status: :forbidden
        return
      end
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: e.message }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { errors: e.message }, status: :unauthorized
    end
  end

  def authorize_admin
    authorize_request
    return if performed?
    unless @current_user&.is_admin?
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end

  def set_current_user_if_present
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    return unless token
    @decoded = decode(token)
    @current_user = User.find(@decoded[:id])
  rescue ActiveRecord::RecordNotFound, JWT::DecodeError
    # silently ignore — optional auth
  end
end
