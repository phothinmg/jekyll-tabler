# frozen_string_literal: true

require_relative "lib/version"

Gem::Specification.new do |spec|
  spec.name = "jekyll-tabler"
  spec.version = Jekyll::Tabler::VERSION
  spec.authors = ["phothinmg"]
  spec.email = ["phothinmg@disroot.org"]

  spec.summary = "TODO: Write a short summary, because RubyGems requires one."
  spec.description = "TODO: Write a longer description or delete this line."
  spec.homepage = "TODO: Put your gem's website or public repo URL here."
  spec.license = "MIT"
  spec.required_ruby_version = ">= 3.2.0"
  spec.metadata["allowed_push_host"] = "TODO: Set to your gem server 'https://example.com'"
  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "TODO: Put your gem's public repo URL here."
  spec.metadata["changelog_uri"] = "TODO: Put your gem's CHANGELOG.md URL here."
  spec.metadata["rubygems_mfa_required"] = "true"
  spec.files = [*Dir["lib/**/*.rb"], *Dir["data/**/*"], "LICENSE.txt", "README.md"]
  spec.require_paths = ["lib"]
  spec.add_dependency "fileutils", ">= 1.8"
  spec.add_dependency "jekyll", "~> 4.4"
  spec.add_dependency "yaml", ">= 0.4.0"
end
