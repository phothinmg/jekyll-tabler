# frozen_string_literal: true

require "jekyll"
require "fileutils"
require "shellwords"
require "yaml"

require_relative "version"

module Jekyll
  # module Jekyll::Tabler
  module Tabler
    VARIABLE_LOOKUP = /\A[a-zA-Z_][\w-]*(?:\.[\w-]+|\[[^\]]+\])*\z/
    OPTION_LOOKUP = /\A([^=\s]+)=(.+)\z/
    VALID_OPTIONS = %w[size color].freeze

    module_function

    def tabler_icons(type)
      data_path = File.join(
        Gem.loaded_specs["jekyll-tabler"].full_gem_path,
        "data",
        "#{type}.yml"
      )
      YAML.load_file(data_path)
    end

    def outline_wrapper(icon_name, size = 24, color = "currentColor") # rubocop:disable Metrics/MethodLength
      icons = tabler_icons("outline")
      ds = Array(icons[icon_name])
      paths = ds.map { |d| %(<path d="#{d}" />) }.join("\n")
      <<~HTML
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
      HTML
    end

    def filled_wrapper(icon_name, size = 24, color = "currentColor") # rubocop:disable Metrics/MethodLength
      icons = tabler_icons("filled")
      ds = Array(icons[icon_name])
      paths = ds.map { |d| %(<path d="#{d}" />) }.join("\n")
      <<~HTML
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
      HTML
    end

    def resolve_argument(argument, context)
      return argument unless argument.is_a?(String) && argument.match?(VARIABLE_LOOKUP)

      resolved = context.evaluate(Liquid::Expression.parse(argument))
      resolved.nil? ? argument : resolved
    end

    def syntax_message
      "Syntax: {% tabler icon_name [size] [color] [size=value] [color=value] %}"
    end

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

    # class Jekyll::Tabler::OutlineTag
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

    # class Jekyll::Tabler::OutlineTag
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

Liquid::Template.register_tag("tabler", Jekyll::Tabler::OutlineTag)
Liquid::Template.register_tag("tabler_filled", Jekyll::Tabler::FilledTag)
