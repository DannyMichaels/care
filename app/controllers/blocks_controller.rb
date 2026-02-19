class BlocksController < ApplicationController
  before_action :authorize_request

  def index
    @blocks = @current_user.blocks_as_blocker.includes(:blocked)
    render json: @blocks.map { |block|
      block.attributes.merge(
        blocked: block.blocked.attributes.except('password_digest', 'updated_at', 'email')
      )
    }
  end

  def create
    @block = @current_user.blocks_as_blocker.new(blocked_id: params[:blocked_id])

    if @block.save
      render json: @block, status: :created
    else
      render json: @block.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @block = @current_user.blocks_as_blocker.find(params[:id])
    @block.destroy
    head :no_content
  end

  def unblock
    @block = @current_user.blocks_as_blocker.find_by!(blocked_id: params[:user_id])
    @block.destroy
    head :no_content
  end
end
