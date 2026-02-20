class AddScheduleToMedications < ActiveRecord::Migration[7.1]
  def change
    add_column :medications, :schedule_unit, :string
    add_column :medications, :schedule_interval, :integer
    add_column :medications, :schedule_end_date, :date
  end
end
