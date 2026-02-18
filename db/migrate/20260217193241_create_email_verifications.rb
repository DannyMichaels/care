class CreateEmailVerifications < ActiveRecord::Migration[7.1]
  def change
    create_table :email_verifications do |t|
      t.string :email, null: false
      t.string :code, null: false
      t.datetime :expires_at, null: false
      t.boolean :verified, default: false

      t.timestamps
    end

    add_index :email_verifications, :email
    add_index :email_verifications, [:email, :code]
  end
end
