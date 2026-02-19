class InsightsController < ApplicationController
  before_action :set_insight, only: [:show]
  before_action :set_current_user_if_present, only: [:index, :show]
  before_action :authorize_request, only: [ :create, :update, :destroy]
  before_action :set_user_insight, only: [ :update, :destroy]

  # GET /insights

  def index
    @insights = Insight.active.includes(:likes, :user, comments: :user).newest_first

    if @current_user
      blocked_ids = @current_user.blocked_users.pluck(:id)
      @insights = @insights.where.not(user_id: blocked_ids) if blocked_ids.any?
    end

    render json: @insights.map {|insight| insight.attributes.except('updated_at', 'user_id').merge({comments: insight.comments}, {user: insight.user.attributes.except('password_digest', 'created_at', 'email', 'updated_at', 'birthday'), likes: insight.likes.map {|like| like.attributes.except('updated_at')} })}
  end

  # GET /insights/1
  def show
    if @insight.status == 'hidden' && !@current_user&.is_admin?
      render json: { error: 'This insight has been hidden' }, status: :not_found
      return
    end

    comments = @insight.comments
    if @current_user
      blocked_ids = @current_user.blocked_users.pluck(:id)
      if blocked_ids.include?(@insight.user_id)
        render json: { error: 'Not found' }, status: :not_found
        return
      end
      comments = comments.where.not(user_id: blocked_ids) if blocked_ids.any?
    end

    my_report = @current_user ? @insight.reports.find_by(user_id: @current_user.id) : nil

    render json: @insight.attributes.except('updated_at', 'user_id').merge(
      {user: @insight.user.attributes.except('password_digest', 'updated_at', 'email')},
      likes: @insight.likes.map {|like| like.attributes.except('updated_at')},
      comments: comments.map {|comment| comment.attributes.merge({user: comment.user.attributes.except("password_digest", "created_at", "updated_at", "email", "birthday")})},
      my_report: my_report&.attributes&.except('updated_at')
    )
  end

  # POST /insights
  def create
    @insight = Insight.new(insight_params)
    @insight.user = @current_user

    moderation_error = ContentModerator.check("#{@insight.title} #{@insight.description} #{@insight.body}")
    if moderation_error
      render json: { error: moderation_error }, status: :unprocessable_entity
      return
    end

    if @insight.save
      # using %w[user likes comments] so that when the front-end receives the json it has the empty likes and empty comments array when adding the new insight to the prevState... because if not and liking without refreshing it will through an error because likes array didn't exist
      render json: @insight, include: %w[user likes comments], status: :created, location: @insight
    else
      render json: @insight.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /insights/1
  def update
    moderation_error = ContentModerator.check("#{insight_params[:title]} #{insight_params[:description]} #{insight_params[:body]}")
    if moderation_error
      render json: { error: moderation_error }, status: :unprocessable_entity
      return
    end

    if @insight.update(insight_params)
      render json: @insight, include: :user
    else
      render json: @insight.errors, status: :unprocessable_entity
    end
  end

  # DELETE /insights/1
  def destroy
    @insight.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
    def set_insight
      @insight = Insight.find(params[:id])
    end

    def set_user_insight
      @insight = @current_user.insights.find(params[:id])
    end
    
    # Only allow a trusted parameter "white list" through.
    def insight_params
      params.require(:insight).permit(:title, :description, :body, :user_id)
    end

end
