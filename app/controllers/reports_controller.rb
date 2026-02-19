class ReportsController < ApplicationController
  before_action :authorize_request, only: [:create]
  before_action :authorize_admin, only: [:index, :update, :remove_insight, :unhide_insight]

  def index
    @reports = Report.joins(:insight).includes(:user, insight: :user)
    @reports = @reports.where(status: params[:status]) if params[:status].present?
    @reports = @reports.order(created_at: :desc)

    render json: @reports.map { |report|
      report.attributes.merge(
        user: report.user&.attributes&.except('password_digest', 'updated_at'),
        insight: report.insight.attributes.merge(
          user: report.insight.user&.attributes&.except('password_digest', 'updated_at')
        )
      )
    }
  end

  def create
    @report = @current_user.reports.new(report_params)

    if @report.save
      render json: @report, status: :created
    else
      render json: @report.errors, status: :unprocessable_entity
    end
  end

  def update
    @report = Report.find(params[:id])

    if @report.update(status: params[:status])
      render json: @report
    else
      render json: @report.errors, status: :unprocessable_entity
    end
  end

  def remove_insight
    @report = Report.find(params[:id])
    @report.insight.update!(status: 'hidden')
    @report.update!(status: 'reviewed')
    render json: { message: 'Insight hidden and report reviewed' }
  end

  def unhide_insight
    @report = Report.find(params[:id])
    @report.insight.update!(status: 'active')
    @report.update!(status: 'pending')
    render json: { message: 'Insight unhidden and report reopened' }
  end

  private

  def report_params
    params.require(:report).permit(:insight_id, :reason)
  end
end
