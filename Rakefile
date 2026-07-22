# frozen_string_literal: true

require "bundler/gem_tasks"
require "rubocop/rake_task"

RuboCop::RakeTask.new

task default: :rubocop

task :setup do
  sh "bin/setup"
end

task :dev do
  sh "bundle exec jekyll serve"
end

task :lint do
  sh "bundle exec rubocop"
end

task :fmt do
  sh "bundle exec rufo ."
end

task :build do
  sh "JEKYLL_ENV=production bundle exec jekyll build"
end

desc "Release to rubygem.org"
task :release do
  # Run Build
  sh "gem build jekyll-tabler.gemspec"
  sh "bash bin/publish"
end

desc "Generate Icons"
task :icons do
  # Update Git Sub Modules
  sh "git submodule update --init --recursive --depth 1 tabler-icon"
  # Generate Icons to Assets
  sh "node bin/icons_to_assets.js"
  # Generate Icons from assets to docs/js/tabler
  sh "node bin/docs_icons.js"
  # Compile icons data from yaml to ruby
  sh "ruby bin/precompile"
  # Remove assets directory
  sh "rm -rf assets"
end
