require 'json'
require 'sinatra'
require 'hashie/mash'

get '/' do
  erb :astro
end

get '/rain' do
  erb :rain
end

get '/color' do
  erb :index
end