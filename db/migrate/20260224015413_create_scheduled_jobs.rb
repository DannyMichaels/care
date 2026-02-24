class CreateScheduledJobs < ActiveRecord::Migration[7.1]
  def change
    create_table :scheduled_jobs do |t|
      t.string :job_class, null: false
      t.jsonb :arguments, default: []
      t.datetime :run_at, null: false
      t.boolean :completed, default: false

      t.timestamps
    end

    add_index :scheduled_jobs, [:completed, :run_at]
  end
end
