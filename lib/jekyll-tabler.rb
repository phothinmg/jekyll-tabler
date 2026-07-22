# frozen_string_literal: true

require "jekyll"
require "shellwords"

require_relative "version"

# Main plugin entrypoint.
module Jekyll
  # Shared helpers and Liquid tag implementations for Tabler icons.
  module Tabler
    VARIABLE_LOOKUP = /\A[a-zA-Z_][\w-]*(?:\.[\w-]+|\[[^\]]+\])*\z/
    OPTION_LOOKUP = /\A([^=\s]+)=(.+)\z/
    VALID_OPTIONS = %w[size color].freeze

    module_function

    # Lazy-loads the precompiled Ruby file only when a specific icon set is first requested.
    # This keeps Jekyll startup speeds instant.
    def tabler_icons(type)
      if type == "filled"
        require_relative "filled_data" unless defined?(FILLED_DATA)
        FILLED_DATA # Ruby reuses this native constant instantly; no extra cache needed
      else
        require_relative "outline_data" unless defined?(OUTLINE_DATA)
        OUTLINE_DATA # Ruby reuses this native constant instantly; no extra cache needed
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

      def render(context)
        icon_name = Jekyll::Tabler.resolve_argument(@icon_name, context)
        size = Jekyll::Tabler.resolve_argument(@size, context)
        color = Jekyll::Tabler.resolve_argument(@color, context)

        Jekyll::Tabler.outline_wrapper(icon_name, size, color)
      end
    end

    # Handles `{% tabler_filled ... %}` tags.
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
