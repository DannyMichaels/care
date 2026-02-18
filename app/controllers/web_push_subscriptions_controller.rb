class WebPushSubscriptionsController < ApplicationController
  before_action :authorize_request, except: [:vapid_key]

  # GET /web_push/vapid_key
  def vapid_key
    render json: { vapid_public_key: ENV['VAPID_PUBLIC_KEY'] }
  end

  # POST /web_push_subscriptions
  def create
    @subscription = @current_user.web_push_subscriptions
      .find_or_initialize_by(endpoint: params[:endpoint])
    @subscription.p256dh = params[:p256dh]
    @subscription.auth = params[:auth]
    @subscription.user_agent = request.user_agent

    if @subscription.save
      render json: @subscription, status: :created
    else
      render json: @subscription.errors, status: :unprocessable_entity
    end
  end

  # POST /web_push_subscriptions/test
  # fetch('http://localhost:3005/web_push_subscriptions/test', { method: 'POST', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken'), 'Content-Type': 'application/json' } }).then(r => r.json()).then(console.log)
  def test
    sub = @current_user.web_push_subscriptions.last
    return render json: { error: 'No subscription found' }, status: :not_found unless sub

    payload = {
      title: 'Care: Test Notification',
      body: 'If you see this, web push works!',
      icon: '/android-chrome-192x192.png',
      data: { url: '/' }
    }.to_json

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
    render json: { success: true, subscription_id: sub.id }
  rescue StandardError => e
    render json: { error: e.class.to_s, message: e.message, backtrace: e.backtrace.first(5) }, status: :internal_server_error
  end

  # DELETE /web_push_subscriptions/:id
  def destroy
    @subscription = @current_user.web_push_subscriptions.find(params[:id])
    @subscription.destroy
    head :no_content
  end
end
