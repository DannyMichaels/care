class UsersController < ApplicationController
  before_action :authorize_request, except: [:create, :index, :show]
  before_action :set_current_user_if_present, only: [:index, :show]
  before_action :set_user, except: [:create, :index]
  before_action :can_modify?, only:[:update, :destroy]

  def index
    @users = User.order('created_at ASC')

    if @current_user
      blocked_ids = @current_user.blocked_users.pluck(:id)
      @users = @users.where.not(id: blocked_ids) if blocked_ids.any?
    end

    render json: @users.map {|user| user.attributes.except('password_digest', 'updated_at').merge(
      {insights_count: user.insights.size},
      {liked_insights: user.liked_insights.order('likes.created_at DESC')},
      {comments: user.comments.order('created_at DESC').map {|comment| comment.attributes.merge({:insight_title => comment.insight.title})}}
      )}
  end

  def show
    user_attrs = @user.attributes.except('password_digest', 'updated_at')
    user_attrs = user_attrs.except('birthday') unless @user.show_age?

    render json: user_attrs.merge({liked_insights: @user.liked_insights}, {insights: @user.insights.map {|insight| insight.attributes.except('updated_at', 'user_id')}})
  end

  # POST /users
  def create
    email = user_params[:email].strip
    existing_user = User.find_by(email: email)

    if existing_user
      render json: {message: "Email already in use"}, status: :unauthorized
      return
    end

    user_params[:email] = user_params[:email].strip
    @user = User.new(user_params)

    if @user.save
      @token = encode({id: @user.id})
      UserMailer.with(user: @user).sign_up_email.deliver_later

      # Send verification code automatically on registration
      verification = EmailVerification.create(email: @user.email.downcase)
      VerificationMailer.verification_code_email(verification).deliver_later if verification.persisted?

      render json: {
        user: @user.attributes.except('password_digest', 'updated_at'),
        token: @token
        }, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    if can_modify?
      if @user.update(user_params)
        UserMailer.with(user: @user).update_account_email.deliver_later
        render json: @user.attributes.except('password_digest', 'created_at'), status: :ok
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    else 
      render json: {error: "Unauthorized action"}, status: :unauthorized
    end
  end


  def destroy
   if can_modify? 
    UserMailer.with(user: @user).delete_account_email.deliver_later
    @user.destroy!
   else 
    render json: {error: "Unauthorized action"}, status: :unauthorized
   end
  end

  private

    def can_modify?
      @current_user.id.to_i == params[:id].to_i
    end
    # Only allow a trusted parameter "white list" through.
    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(:name, :email, :birthday, :gender, :image, :password, :show_age)
    end

end
