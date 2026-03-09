class AddAppleUidToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :apple_uid, :string
    add_index :users, :apple_uid, unique: true
  end
end
