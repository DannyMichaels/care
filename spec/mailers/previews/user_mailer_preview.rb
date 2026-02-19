require 'ostruct'

class UserMailerPreview < ActionMailer::Preview
  def sign_up_email
    UserMailer.with(user: preview_user).sign_up_email
  end

  def update_account_email
    UserMailer.with(user: preview_user).update_account_email
  end

  def delete_account_email
    UserMailer.with(user: preview_user).delete_account_email
  end

  private

  def preview_user
    User.first || OpenStruct.new(name: 'Jane', email: 'jane@example.com')
  end
end
