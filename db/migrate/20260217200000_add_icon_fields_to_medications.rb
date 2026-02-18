class AddIconFieldsToMedications < ActiveRecord::Migration[7.1]
  def change
    add_column :medications, :icon, :string, default: 'pill'
    add_column :medications, :icon_color, :string, default: '#7E57C2'
  end
end
