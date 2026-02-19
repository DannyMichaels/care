class CreateReports < ActiveRecord::Migration[7.1]
  def change
    create_table :reports do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :insight, null: false, foreign_key: { on_delete: :cascade }
      t.string :reason, null: false
      t.string :status, default: 'pending', null: false
      t.timestamps
    end
    add_index :reports, [:user_id, :insight_id], unique: true
  end
end
