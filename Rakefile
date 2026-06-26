# frozen_string_literal: true

require "bundler/gem_tasks"
require "rubocop/rake_task"

RuboCop::RakeTask.new

task default: :rubocop

# initial setup
task :setup do
  sh "bin/setup"
end

task :install do
  sh "bundle install"
end

task :build do
  sh "gem build jekyll-tabler.gemspec"
end

task :publish do
  sh "bash bin/publish"
end
