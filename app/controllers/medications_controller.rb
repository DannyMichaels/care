class MedicationsController < ApplicationController
  before_action :authorize_request, only: [:index, :show, :create, :update, :destroy]
  before_action :set_user_medication, only: [ :update, :destroy]

  # GET /medications/rx_guide
  def rx_guide
    response = HTTParty.get(
      "https://api.airtable.com/v0/#{ENV['RXGUIDE_AIRTABLE_BASE']}/prescriptions",
      headers: { "Authorization" => "Bearer #{ENV['RXGUIDE_AIRTABLE_KEY']}" }
    )
    render json: response.parsed_response["records"]
  end

  # GET /medications
  def index
    @medications = @current_user.medications 
    render json: @medications
  end

  # GET /medications/1
  def show
    begin
      @medication = Medication.find_by(id: params[:id], user_id: @current_user.id)

      if @medication
        render json: @medication
      else
        render json: { message: "Medication not found" }, status: :not_found
      end
    rescue => e
      Rails.logger.error("Medication#show failed: #{e.message}")
      render json: { error: e.message }, status: :internal_server_error
    end
  end

  # POST /medications
  def create
    @medication = Medication.new(medication_params)
    @medication.user = @current_user

    if @medication.save
      schedule_notification(@medication)
      render json: @medication, status: :created, location: @medication
    else
      render json: @medication.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /medications/1
  def update
    if @medication.update(medication_params)
      schedule_notification(@medication)
      render json: @medication
    else
      render json: @medication.errors, status: :unprocessable_entity
    end
  end

  # DELETE /medications/1
  def destroy
    @medication.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_medication
      @medication = Medication.find(params[:id])
    end

    def set_user_medication
      @medication = @current_user.medications.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def medication_params
      params.require(:medication).permit(:name, :medication_class, :reason, :image, :time, :user_id, :is_taken, :taken_date, :icon, :icon_color)
    end

    def schedule_notification(medication)
      return if medication.is_taken
      return unless medication.time.present?

      med_time = Time.parse(medication.time.to_s)
      delay = med_time - Time.current

      return unless delay.positive?

      MedicationNotificationJob.set(wait: delay.seconds).perform_later(medication.id, medication.time.to_s)
    rescue ArgumentError
      # Skip scheduling if time can't be parsed
    end
end
