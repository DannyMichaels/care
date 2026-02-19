class AddShowAgeToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :show_age, :boolean, default: false, null: false
  end
end
