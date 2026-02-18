Rails.application.routes.draw do
  resources :likes, :only => [:show, :index, :destroy, :create]
  resources :medications do
    collection do
      get :rx_guide
    end
  end
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
  #routes only for create and index for users controller
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
