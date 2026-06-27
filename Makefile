SHELL := bash

.PHONY: dev build lint format


dev:
	bundle exec jekyll serve
build:
	JEKYLL_ENV=production bundle exec jekyll build
format:
	bundle exec rufo .

lint:
	bundle exec rubocop