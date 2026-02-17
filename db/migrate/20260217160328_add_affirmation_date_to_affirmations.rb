class AddAffirmationDateToAffirmations < ActiveRecord::Migration[7.1]
  def change
    add_column :affirmations, :affirmation_date, :date
  end
end
