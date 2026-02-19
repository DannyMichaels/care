class AddStatusToInsights < ActiveRecord::Migration[7.1]
  def change
    add_column :insights, :status, :string, default: 'active', null: false
  end
end
