# frozen_string_literal: true

require_relative "lib/version"

Gem::Specification.new do |spec|
  spec.name = "jekyll-tabler"
  spec.version = Jekyll::Tabler::VERSION
  spec.authors = ["phothinmg"]
  spec.email = ["phothinmg@disroot.org"]
  spec.summary = "Tabler Icons plugin for Jekyll site as liquid tag"
  spec.homepage = "https://github.com/phothinmg/jekyll-tabler"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 3.2.0"
  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["changelog_uri"] = "https://github.com/phothinmg/jekyll-tabler/blob/main/CHANGELOG.md"
  spec.metadata["rubygems_mfa_required"] = "true"
  spec.files = [*Dir["lib/**/*.rb"], "LICENSE.txt", "README.md"]
  # spec.files = Dir.chdir(File.expand_path(__dir__)) do
  #   `git ls-files -z`.split("\x0").reject do |f|
  #     f.match(%r{^(test|spec|features|assets)/}) # Exclude assets directory from final distribution
  #   end
  # end
  spec.require_paths = ["lib"]
  spec.add_dependency "jekyll", "~> 4.4"
  spec.add_dependency "shellwords", ">= 0.2.2"
end
