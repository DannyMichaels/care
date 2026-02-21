class AddTimeToMedicationOccurrences < ActiveRecord::Migration[7.1]
  def change
    add_column :medication_occurrences, :time, :datetime
  end
end
