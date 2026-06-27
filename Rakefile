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

desc "Release to rubygem.org"
task :release do
  puts "Start Building ..."
  # Run Build
  Rake::Task[:build].invoke
  Rake::Task[:publish].invoke
end

desc "Generate Icons"
task :icons, [:base, :cat] do |_, args|
  base = args[:base] || nil
  cat = args[:cat] || nil
  if base.nil? && cat.nil?
    # Generate all icons for plugin
    # Run: rake icons
    system("node", "bin/icons")
  elsif !base.nil? && cat.nil?
    # Generate base[--outline,--filled] icons for plugin
    # Run: rake icons[--outline] || rake icons[--filled]
    system("node", "bin/icons", base)
  elsif !base.nil? && !cat.nil?
    # For documentation site
    # Generate category with base[--outline,--filled]
    # Run: rake icons[--outline,--docs] || rake icons[--filled,--docs]
    system("node", "bin/icons", base, cat)
  end
end
