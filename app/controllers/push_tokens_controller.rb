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

  # DELETE /push_tokens/:id
  def destroy
    @push_token = @current_user.push_tokens.find(params[:id])
    @push_token.destroy
    head :no_content
  end
end
