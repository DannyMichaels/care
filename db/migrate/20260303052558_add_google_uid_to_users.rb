class AddGoogleUidToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :google_uid, :string
    add_index :users, :google_uid, unique: true
    change_column_null :users, :password_digest, true
  end
end
