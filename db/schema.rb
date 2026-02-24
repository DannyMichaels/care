# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_02_24_015413) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "affirmations", force: :cascade do |t|
    t.string "content"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "affirmation_date"
    t.index ["user_id"], name: "index_affirmations_on_user_id"
  end

  create_table "blocks", force: :cascade do |t|
    t.bigint "blocker_id", null: false
    t.bigint "blocked_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["blocked_id"], name: "index_blocks_on_blocked_id"
    t.index ["blocker_id", "blocked_id"], name: "index_blocks_on_blocker_id_and_blocked_id", unique: true
    t.index ["blocker_id"], name: "index_blocks_on_blocker_id"
  end

  create_table "comments", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "insight_id", null: false
    t.string "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["insight_id"], name: "index_comments_on_insight_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "email_verifications", force: :cascade do |t|
    t.string "email", null: false
    t.string "code", null: false
    t.datetime "expires_at", null: false
    t.boolean "verified", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email", "code"], name: "index_email_verifications_on_email_and_code"
    t.index ["email"], name: "index_email_verifications_on_email"
  end

  create_table "foods", force: :cascade do |t|
    t.string "name", limit: 20
    t.datetime "time", precision: nil
    t.integer "rating"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "factors"
    t.index ["user_id"], name: "index_foods_on_user_id"
  end

  create_table "insights", force: :cascade do |t|
    t.string "title", limit: 50
    t.string "description"
    t.text "body"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status", default: "active", null: false
    t.index ["user_id"], name: "index_insights_on_user_id"
  end

  create_table "likes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "insight_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["insight_id", "user_id"], name: "index_likes_on_insight_id_and_user_id", unique: true
    t.index ["insight_id"], name: "index_likes_on_insight_id"
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "medication_occurrences", force: :cascade do |t|
    t.bigint "medication_id", null: false
    t.date "occurrence_date", null: false
    t.boolean "is_taken", default: false
    t.datetime "taken_date"
    t.boolean "skipped", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "time"
    t.index ["medication_id", "occurrence_date"], name: "index_med_occurrences_on_med_id_and_date", unique: true
    t.index ["medication_id"], name: "index_medication_occurrences_on_medication_id"
  end

  create_table "medications", force: :cascade do |t|
    t.string "name"
    t.datetime "time", precision: nil
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "medication_class"
    t.string "reason"
    t.string "image"
    t.boolean "is_taken"
    t.datetime "taken_date", precision: nil
    t.string "icon", default: "pill"
    t.string "icon_color", default: "#7E57C2"
    t.string "schedule_unit"
    t.integer "schedule_interval"
    t.date "schedule_end_date"
    t.boolean "skipped", default: false
    t.index ["user_id"], name: "index_medications_on_user_id"
  end

  create_table "moods", force: :cascade do |t|
    t.string "status"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "time", precision: nil
    t.string "reason"
    t.index ["user_id"], name: "index_moods_on_user_id"
  end

  create_table "push_tokens", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "token", null: false
    t.string "platform"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["token"], name: "index_push_tokens_on_token", unique: true
    t.index ["user_id", "token"], name: "index_push_tokens_on_user_id_and_token", unique: true
    t.index ["user_id"], name: "index_push_tokens_on_user_id"
  end

  create_table "reports", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "insight_id", null: false
    t.string "reason", null: false
    t.string "status", default: "pending", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["insight_id"], name: "index_reports_on_insight_id"
    t.index ["user_id", "insight_id"], name: "index_reports_on_user_id_and_insight_id", unique: true
    t.index ["user_id"], name: "index_reports_on_user_id"
  end

  create_table "scheduled_jobs", force: :cascade do |t|
    t.string "job_class", null: false
    t.jsonb "arguments", default: []
    t.datetime "run_at", null: false
    t.boolean "completed", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["completed", "run_at"], name: "index_scheduled_jobs_on_completed_and_run_at"
  end

  create_table "symptoms", force: :cascade do |t|
    t.string "name", limit: 20
    t.datetime "time", precision: nil
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_symptoms_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", limit: 30
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "gender"
    t.date "birthday"
    t.string "image"
    t.boolean "email_verified", default: false
    t.boolean "is_admin", default: false, null: false
    t.boolean "show_age", default: false, null: false
  end

  create_table "web_push_subscriptions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "endpoint", null: false
    t.string "p256dh", null: false
    t.string "auth", null: false
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "endpoint"], name: "index_web_push_subscriptions_on_user_id_and_endpoint", unique: true
    t.index ["user_id"], name: "index_web_push_subscriptions_on_user_id"
  end

  add_foreign_key "affirmations", "users", on_delete: :cascade
  add_foreign_key "blocks", "users", column: "blocked_id", on_delete: :cascade
  add_foreign_key "blocks", "users", column: "blocker_id", on_delete: :cascade
  add_foreign_key "comments", "insights", on_delete: :cascade
  add_foreign_key "comments", "users", on_delete: :cascade
  add_foreign_key "foods", "users", on_delete: :cascade
  add_foreign_key "insights", "users", on_delete: :cascade
  add_foreign_key "likes", "insights", on_delete: :cascade
  add_foreign_key "likes", "users", on_delete: :cascade
  add_foreign_key "medication_occurrences", "medications"
  add_foreign_key "medications", "users", on_delete: :cascade
  add_foreign_key "moods", "users", on_delete: :cascade
  add_foreign_key "push_tokens", "users", on_delete: :cascade
  add_foreign_key "reports", "insights", on_delete: :cascade
  add_foreign_key "reports", "users", on_delete: :cascade
  add_foreign_key "symptoms", "users", on_delete: :cascade
  add_foreign_key "web_push_subscriptions", "users", on_delete: :cascade
end
