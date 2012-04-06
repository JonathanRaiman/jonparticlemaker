require 'json'
require 'sinatra'
require 'hashie/mash'

get '/' do
  erb :time
end

get '/rain' do
  erb :rain
end

get '/color' do
  erb :index
end

get '/astro' do
  erb :astro
end