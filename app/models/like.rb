class Like < ApplicationRecord
  belongs_to :user
  belongs_to :insight

  # a insight_id should be unique for the user_id
  validates :insight, uniqueness: {scope: :user}
  def insight_name
    self.insight.title
  end
end
