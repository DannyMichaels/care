class MedicationOccurrencesController < ApplicationController
  before_action :authorize_request
  before_action :set_medication, only: [:index, :create, :update, :destroy, :destroy_untaken]
  before_action :set_occurrence, only: [:update, :destroy]

  # GET /medications/:medication_id/occurrences?from=&to=
  def index
    occurrences = @medication.medication_occurrences
    occurrences = occurrences.where('occurrence_date >= ?', params[:from]) if params[:from].present?
    occurrences = occurrences.where('occurrence_date <= ?', params[:to]) if params[:to].present?
    render json: occurrences
  end

  # GET /medication_occurrences?from=&to=
  def batch_index
    med_ids = @current_user.medications.pluck(:id)
    occurrences = MedicationOccurrence.where(medication_id: med_ids)
    occurrences = occurrences.where('occurrence_date >= ?', params[:from]) if params[:from].present?
    occurrences = occurrences.where('occurrence_date <= ?', params[:to]) if params[:to].present?
    render json: occurrences
  end

  # POST /medications/:medication_id/occurrences
  def create
    occurrence = @medication.medication_occurrences.new(occurrence_params)
    if occurrence.save
      render json: occurrence, status: :created
    else
      render json: occurrence.errors, status: :unprocessable_entity
    end
  end

  # PUT /medications/:medication_id/occurrences/:id
  def update
    if @occurrence.update(occurrence_params)
      render json: @occurrence
    else
      render json: @occurrence.errors, status: :unprocessable_entity
    end
  end

  # DELETE /medications/:medication_id/occurrences/:id
  def destroy
    @occurrence.destroy
    head :no_content
  end

  # DELETE /medications/:medication_id/occurrences/destroy_untaken
  def destroy_untaken
    count = @medication.medication_occurrences.where(is_taken: false).delete_all
    render json: { deleted: count }
  end

  private

  def set_medication
    @medication = @current_user.medications.find(params[:medication_id])
  end

  def set_occurrence
    @occurrence = @medication.medication_occurrences.find(params[:id])
  end

  def occurrence_params
    params.permit(:occurrence_date, :is_taken, :taken_date, :skipped, :time)
  end
end
