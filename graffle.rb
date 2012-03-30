require 'json'
require 'sinatra'
require 'hashie/mash'

get '/' do
  erb :index
end

get '/rain' do
  erb :rain
end