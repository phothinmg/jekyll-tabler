# frozen_string_literal: true

# Copyright (c) 2026 phothinmg
# <https://github.com/phothinmg/jekyll-tabler>

require "jekyll"
require "fileutils"
require "shellwords"
require "yaml"

require_relative "version"

# Main plugin entrypoint.
#
# Flow overview for maintainers:
# 1. This file is required by Jekyll when the plugin is listed in `_config.yml`.
# 2. The two Liquid tags are registered at the bottom of the file.
# 3. When Jekyll parses a page containing `{% tabler %}` or
#    `{% tabler_filled %}`, Liquid instantiates the matching tag class and
#    runs `initialize` once to parse the markup.
# 4. During page rendering, Liquid calls `render`, which resolves literal
#    values or Liquid variables from the page context.
# 5. The resolved icon name is looked up in the packaged YAML asset and then
#    wrapped in SVG markup for the final HTML output.
module Jekyll
  # Shared helpers and Liquid tag implementations for Tabler icons.
  module Tabler
    VARIABLE_LOOKUP = /\A[a-zA-Z_][\w-]*(?:\.[\w-]+|\[[^\]]+\])*\z/
    OPTION_LOOKUP = /\A([^=\s]+)=(.+)\z/
    VALID_OPTIONS = %w[size color].freeze

    module_function

    # Loads the icon path data that ships with the gem.
    #
    # The YAML files map an icon name to one or more SVG path definitions.
    # This is the only place where the plugin reaches into packaged assets.
    #
    # Results are memoized in a module-level cache so each file is read and
    # parsed exactly once per build, regardless of how many tag renders occur.
    def tabler_icons(type)
      @tabler_icons_cache ||= {}
      @tabler_icons_cache[type] ||= begin
        data_path = File.join(
          Gem.loaded_specs["jekyll-tabler"].full_gem_path,
          "assets",
          "#{type}.yml"
        )
        YAML.load_file(data_path)
      end
    end

    # Builds the outline SVG after render-time values have been resolved.
    def outline_wrapper(icon_name, size = 24, color = "currentColor") # rubocop:disable Metrics/MethodLength
      icons = tabler_icons("outline")
      ds = Array(icons[icon_name])
      paths = ds.map { |d| %(<path d="#{d}" />) }.join("\n")
      <<~SVG
        <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#{color}"
        width="#{size}"
        height="#{size}"
        class="jekyll-tabler-icon #{icon_name}"
        >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        #{paths}
        </svg>
      SVG
    end

    # Builds the filled SVG after render-time values have been resolved.
    def filled_wrapper(icon_name, size = 24, color = "currentColor") # rubocop:disable Metrics/MethodLength
      icons = tabler_icons("filled")
      ds = Array(icons[icon_name])
      paths = ds.map { |d| %(<path d="#{d}" />) }.join("\n")
      <<~SVG
        <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="#{size}"
        height="#{size}"
        fill="#{color}"
        class="jekyll-tabler-icon #{icon_name}"
        >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        #{paths}
        </svg>
      SVG
    end

    # Resolves a tag argument against the Liquid context when it looks like a
    # variable lookup. Literal values such as `24` or `currentColor` pass
    # through unchanged.
    def resolve_argument(argument, context)
      return argument unless argument.is_a?(String) && argument.match?(VARIABLE_LOOKUP)

      resolved = context.evaluate(Liquid::Expression.parse(argument))
      resolved.nil? ? argument : resolved
    end

    # Shared syntax error message used by both tags.
    def syntax_message
      "Syntax: {% tabler|tabler_filled icon_name [size] [color] [size=value] [color=value] %}"
    end

    # Splits optional arguments into named options and positional arguments.
    #
    # Named options are validated here so each tag class can keep its
    # initializer focused on assigning the final values.
    def parse_optional_args(arguments) # rubocop:disable Metrics/MethodLength
      arguments.each_with_object([{}, []]) do |argument, memo|
        options = memo[0]
        positional_args = memo[1]
        match = argument.match(OPTION_LOOKUP)

        unless match
          positional_args << argument
          next
        end

        key = match[1]
        raise Liquid::SyntaxError, "Unknown #{key} option in tabler tag" unless VALID_OPTIONS.include?(key)
        raise Liquid::SyntaxError, "Duplicate #{key} option in tabler tag" if options.key?(key)

        options[key] = match[2]
      end
    end

    # Handles `{% tabler ... %}` tags.
    #
    # `initialize` runs during Liquid parsing, not page rendering, so this
    # method only stores raw arguments. Variable resolution happens later in
    # `render` when the page context is available.
    class OutlineTag < Liquid::Tag
      def initialize(tag_name, markup, tokens) # rubocop:disable Metrics/AbcSize
        super

        args = Shellwords.shellsplit(markup.to_s)
        raise Liquid::SyntaxError, Jekyll::Tabler.syntax_message if args.empty?

        @icon_name = args[0]
        options, positional_args = Jekyll::Tabler.parse_optional_args(args.drop(1))

        raise Liquid::SyntaxError, Jekyll::Tabler.syntax_message if positional_args.length > 2

        @size = options.fetch("size", positional_args[0] || 24)
        @color = options.fetch("color", positional_args[1] || "currentColor")
      rescue ArgumentError => e
        raise Liquid::SyntaxError, e.message
      end

      # Converts stored arguments into final values for the current page and
      # delegates SVG generation to the shared helper.
      def render(context)
        icon_name = Jekyll::Tabler.resolve_argument(@icon_name, context)
        size = Jekyll::Tabler.resolve_argument(@size, context)
        color = Jekyll::Tabler.resolve_argument(@color, context)

        Jekyll::Tabler.outline_wrapper(icon_name, size, color)
      end
    end

    # Handles `{% tabler_filled ... %}` tags.
    #
    # The control flow mirrors `OutlineTag`; the only behavior difference is
    # the final SVG wrapper that uses filled icon data.
    class FilledTag < Liquid::Tag
      def initialize(tag_name, markup, tokens) # rubocop:disable Metrics/AbcSize
        super

        args = Shellwords.shellsplit(markup.to_s)
        raise Liquid::SyntaxError, Jekyll::Tabler.syntax_message if args.empty?

        @icon_name = args[0]
        options, positional_args = Jekyll::Tabler.parse_optional_args(args.drop(1))

        raise Liquid::SyntaxError, Jekyll::Tabler.syntax_message if positional_args.length > 2

        @size = options.fetch("size", positional_args[0] || 24)
        @color = options.fetch("color", positional_args[1] || "currentColor")
      rescue ArgumentError => e
        raise Liquid::SyntaxError, e.message
      end

      # Converts stored arguments into final values for the current page and
      # delegates SVG generation to the shared helper.
      def render(context)
        icon_name = Jekyll::Tabler.resolve_argument(@icon_name, context)
        size = Jekyll::Tabler.resolve_argument(@size, context)
        color = Jekyll::Tabler.resolve_argument(@color, context)

        Jekyll::Tabler.filled_wrapper(icon_name, size, color)
      end
    end
  end
end

# Register the Liquid tags once on load so Jekyll can resolve them while
# parsing site templates.
Liquid::Template.register_tag("tabler", Jekyll::Tabler::OutlineTag)
Liquid::Template.register_tag("tabler_filled", Jekyll::Tabler::FilledTag)
