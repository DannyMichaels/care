class PushTokensController < ApplicationController
  before_action :authorize_request

  # POST /push_tokens
  def create
    @push_token = @current_user.push_tokens.find_or_initialize_by(token: params[:token])
    @push_token.platform = params[:platform]

    if @push_token.save
      render json: @push_token, status: :created
    else
      render json: @push_token.errors, status: :unprocessable_entity
    end
  end

  # POST /push_tokens/test
  # fetch('http://localhost:3005/push_tokens/test', { method: 'POST', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken'), 'Content-Type': 'application/json' } }).then(r => r.json()).then(console.log)
  def test
    token = @current_user.push_tokens.last
    return render json: { error: 'No push token found' }, status: :not_found unless token

    message = {
      to: token.token,
      sound: 'default',
      title: 'Care: Test Notification',
      body: 'If you see this, Expo push works!',
      data: { medication_id: @current_user.medications.last&.id }
    }

    response = HTTParty.post(
      'https://exp.host/--/api/v2/push/send',
      body: [message].to_json,
      headers: {
        'Accept' => 'application/json',
        'Content-Type' => 'application/json'
      }
    )
    render json: { success: true, expo_response: response.parsed_response }
  rescue StandardError => e
    render json: { error: e.class.to_s, message: e.message }, status: :internal_server_error
  end

  # DELETE /push_tokens/:id
  def destroy
    @push_token = @current_user.push_tokens.find(params[:id])
    @push_token.destroy
    head :no_content
  end
end
