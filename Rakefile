# frozen_string_literal: true

require "bundler/gem_tasks"
require "rubocop/rake_task"

RuboCop::RakeTask.new

task default: :rubocop

# 1. Initial Setup
# ================
task :setup do
  sh "bin/setup"
end

# 2. Bundle
# =========

task :install do
  sh "bundle install"
end

# 3. Plugin
# =========
task :plugin_build do
  sh "gem build jekyll-tabler.gemspec"
end

task :publish do
  sh "bash bin/publish"
end

desc "Release to rubygem.org"
task :release do
  puts "Start Building ..."
  # Run Build
  Rake::Task[:plugin_build].invoke
  Rake::Task[:publish].invoke
  puts "Finished"
end

# 4. Icons
# ========
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

# 5. Jekyll Docs Site
# ===================
desc "Dev"
task :dev do
  sh "bundle exec jekyll serve"
end

desc "Build"
task :site_build do
  sh "JEKYLL_ENV=production bundle exec jekyll build"
end

# 6. Git Sub Modules
# ==================
desc "Update"
task :update_git do
  sh "git submodule update --init --recursive --depth 1 tabler-icon"
end
