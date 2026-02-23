class MedicationsController < ApplicationController
  before_action :authorize_request, only: [:index, :show, :create, :update, :destroy, :dashboard]
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

  # GET /medications/dashboard?date=2026-02-19
  def dashboard
    medications = @current_user.medications
    date = params[:date]
    utc_offset = params[:utc_offset].to_i

    if date.present?
      parsed_date = Date.parse(date)

      occ_map = MedicationOccurrence
        .where(medication_id: medications.select(:id), occurrence_date: date)
        .index_by(&:medication_id)

      filtered = medications.select do |med|
        if med.recurring?
          med.occurs_on_date?(parsed_date, utc_offset_minutes: utc_offset)
        else
          med.time.present? && (med.time - utc_offset.minutes).to_date == parsed_date
        end
      end
    else
      occ_map = {}
      filtered = medications
    end

    result = filtered.map do |med|
      med.as_json.merge('occurrence' => occ_map[med.id]&.as_json)
    end

    render json: result
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
    handle_schedule_conversion if converting_to_one_time?

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
      params.require(:medication).permit(:name, :medication_class, :reason, :image, :time, :user_id, :is_taken, :taken_date, :icon, :icon_color, :schedule_unit, :schedule_interval, :schedule_end_date, :skipped)
    end

    def converting_to_one_time?
      @medication.schedule_unit.present? &&
        params[:medication].key?(:schedule_unit) &&
        params.dig(:medication, :schedule_unit).blank?
    end

    def handle_schedule_conversion
      target_date = params[:conversion_date]
      return unless target_date.present?

      occ = @medication.medication_occurrences.find_by(occurrence_date: target_date)
      if occ&.is_taken
        params[:medication][:is_taken] = true
        params[:medication][:taken_date] = occ.taken_date
      end

      incoming_time = params.dig(:medication, :time)
      time_source = incoming_time.present? ? Time.parse(incoming_time.to_s) : @medication.time
      params[:medication][:time] = Time.parse("#{target_date}T#{time_source.strftime('%H:%M:%S')}").iso8601

      if params[:occurrence_action] == 'delete_all'
        @medication.medication_occurrences.destroy_all
      end
    end

    def schedule_notification(medication)
      return unless medication.time.present?

      if medication.recurring?
        today = Date.current
        return unless medication.occurs_on_date?(today)
        return if medication.occurrence_handled?(today)

        scheduled_time = Time.current.change(hour: medication.time.hour, min: medication.time.min, sec: medication.time.sec)
        delay = scheduled_time - Time.current
        return unless delay.positive?

        MedicationNotificationJob.set(wait: delay.seconds).perform_later(medication.id, medication.time.to_s, today.to_s)
      else
        return if medication.is_taken

        med_time = Time.parse(medication.time.to_s)
        delay = med_time - Time.current
        return unless delay.positive?

        MedicationNotificationJob.set(wait: delay.seconds).perform_later(medication.id, medication.time.to_s)
      end
    rescue ArgumentError
      # Skip scheduling if time can't be parsed
    end
end
