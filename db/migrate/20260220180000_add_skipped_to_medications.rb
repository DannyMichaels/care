class AddSkippedToMedications < ActiveRecord::Migration[7.1]
  def change
    add_column :medications, :skipped, :boolean, default: false
  end
end
