class AddColumnToUsers2 < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :birthday, :date
  end
end
