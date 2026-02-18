class CreateWebPushSubscriptions < ActiveRecord::Migration[7.1]
  def change
    create_table :web_push_subscriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :endpoint, null: false
      t.string :p256dh, null: false
      t.string :auth, null: false
      t.string :user_agent

      t.timestamps
    end

    add_index :web_push_subscriptions, [:user_id, :endpoint], unique: true
  end
end
