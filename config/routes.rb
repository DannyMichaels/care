require 'sidekiq/web'
require 'sidekiq/cron/web'

Sidekiq::Web.use ActionDispatch::Cookies
Sidekiq::Web.use ActionDispatch::Session::CookieStore, key: '_care_sidekiq_session'
Sidekiq::Web.use Rack::Auth::Basic, 'Sidekiq' do |username, password|
  ActiveSupport::SecurityUtils.secure_compare(username, ENV.fetch('SIDEKIQ_USERNAME', 'admin')) &
    ActiveSupport::SecurityUtils.secure_compare(password, ENV.fetch('SIDEKIQ_PASSWORD', 'password'))
end

Rails.application.routes.draw do
  mount Sidekiq::Web => '/sidekiq'

  resources :likes, :only => [:show, :index, :destroy, :create]
  resources :medications do
    collection do
      get :rx_guide
      get :dashboard
    end
    resources :occurrences, controller: 'medication_occurrences', only: [:index, :create, :update, :destroy] do
      collection do
        delete :destroy_untaken
      end
    end
  end
  get 'medication_occurrences', to: 'medication_occurrences#batch_index'
  resources :foods
  resources :symptoms
  resources :affirmations
  resources :moods
  post '/auth/login', to: 'authentication#login'
  get '/auth/verify', to: 'authentication#verify'
  post '/auth/reset_password', to: 'authentication#reset_password'
  resources :users
  resources :insights do
    resources :comments
  end
  resources :push_tokens, only: [:create, :destroy] do
    collection do
      post :test
    end
  end
  get '/web_push/vapid_key', to: 'web_push_subscriptions#vapid_key'
  resources :web_push_subscriptions, only: [:create, :destroy] do
    collection do
      post :test
    end
  end
  resources :email_verifications, only: [:create] do
    collection do
      post :verify
    end
  end
  resources :reports, only: [:index, :create, :update] do
    member do
      delete :remove_insight
      patch :unhide_insight
    end
  end
  resources :blocks, only: [:index, :create, :destroy] do
    collection do
      delete 'unblock/:user_id', action: :unblock, as: :unblock
    end
  end
end
