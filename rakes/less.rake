desc 'Preprocess LESS files to create CSS'
task :less do
	require 'less'
	Less.paths << File.dirname(__FILE__)+"/../less"
	Less.paths << File.dirname(__FILE__)+"/../less/bootstrap"
	less = File.open(File.dirname(__FILE__)+"/../less/style.less", 'r').read
	parser = Less::Parser.new
	tree = parser.parse less
	css = tree.to_css
	if !File.exists?(File.dirname(__FILE__)+"/../public/css/") then Dir.mkdir(File.dirname(__FILE__)+"/../public/css/") end
	File.open(File.dirname(__FILE__)+"/../public/css/style.css", 'w') {|f| f.write(css) }
end
