Rails.application.routes.draw do
  resources :likes, :only => [:show, :index, :destroy, :create]
  resources :medications
  resources :foods
  resources :symptoms
  resources :affirmations
  resources :insights
  resources :moods
  post '/auth/login', to: 'authentication#login'
  get '/auth/verify', to: 'authentication#verify'
  resources :users
  #routes only for create and index for users controller
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
