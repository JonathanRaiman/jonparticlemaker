require 'rubygems'
require 'json'
require 'sinatra'
require 'hashie/mash'
# require 'sinatra/activerecord'

# db = URI.parse(ENV['DATABASE_URL'] || 'postgres://localhost/mydb')

# ActiveRecord::Base.establish_connection(
#   :adapter  => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
#   :host     => db.host,
#   :username => db.user,
#   :password => db.password,
#   :database => db.path[1..-1],
#   :encoding => 'utf8'
# )

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

get '/all' do
  erb :time_all
end