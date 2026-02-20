class CreateMedicationOccurrences < ActiveRecord::Migration[7.1]
  def change
    create_table :medication_occurrences do |t|
      t.references :medication, null: false, foreign_key: true
      t.date :occurrence_date, null: false
      t.boolean :is_taken, default: false
      t.datetime :taken_date
      t.boolean :skipped, default: false

      t.timestamps
    end

    add_index :medication_occurrences, [:medication_id, :occurrence_date], unique: true, name: 'index_med_occurrences_on_med_id_and_date'
  end
end
