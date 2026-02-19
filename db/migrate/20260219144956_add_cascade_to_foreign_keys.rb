class AddCascadeToForeignKeys < ActiveRecord::Migration[7.1]
  def change
    remove_foreign_key :affirmations, :users
    add_foreign_key :affirmations, :users, on_delete: :cascade

    remove_foreign_key :comments, :users
    add_foreign_key :comments, :users, on_delete: :cascade

    remove_foreign_key :comments, :insights
    add_foreign_key :comments, :insights, on_delete: :cascade

    remove_foreign_key :foods, :users
    add_foreign_key :foods, :users, on_delete: :cascade

    remove_foreign_key :insights, :users
    add_foreign_key :insights, :users, on_delete: :cascade

    remove_foreign_key :likes, :users
    add_foreign_key :likes, :users, on_delete: :cascade

    remove_foreign_key :likes, :insights
    add_foreign_key :likes, :insights, on_delete: :cascade

    remove_foreign_key :medications, :users
    add_foreign_key :medications, :users, on_delete: :cascade

    remove_foreign_key :moods, :users
    add_foreign_key :moods, :users, on_delete: :cascade

    remove_foreign_key :push_tokens, :users
    add_foreign_key :push_tokens, :users, on_delete: :cascade

    remove_foreign_key :symptoms, :users
    add_foreign_key :symptoms, :users, on_delete: :cascade

    remove_foreign_key :web_push_subscriptions, :users
    add_foreign_key :web_push_subscriptions, :users, on_delete: :cascade
  end
end
