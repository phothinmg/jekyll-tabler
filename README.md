<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->
<p align="center">
<img src="https://susee.phothin.dev/logo/rubygems_logo.png" width="160" height="160" alt="rubygems" style="border-radius:50%" />
</p>
<h1 align="center">Jekyll::Tabler</h1>

[![Gem Version](https://badge.fury.io/rb/jekyll-tabler.svg)](https://badge.fury.io/rb/jekyll-tabler)

## Overview

[Tabler Icons](https://tabler.io/icons) plugin for Jekyll site as liquid tag.

> [!WARNING]
> If you are using a released version up to `0.1.2`, see [Performance note for older versions](#performance-note-for-older-versions). Those releases re-load and re-parse the icon YAML files on every `{% tabler %}` and `{% tabler_filled %}` render, which can slow down builds on sites that generate many pages.

## Installation

Install the gem and add to the application's Gemfile by executing:

```sh
bundle add jekyll-tabler
```

In your `Gemfile`:

```ruby
group :jekyll_plugins do
  # other jekyll plugins
  gem 'jekyll-tabler' # add tabler plugin
end
```

If bundler is not being used to manage dependencies, install the gem by executing:

```bash
gem install jekyll-tabler
```

## Usage

Register the plugin in your Jekyll site and render icons with the `tabler` Liquid tag:

### Jekyll site configuration

**`_config.yml`**

```yaml
plugins:
  - jekyll-tabler
```

### Liquid Tags

- **Outline Tag** : `{% tabler icon_name [size] [color] [size=value] [color=value] %}`
- **Filled Tag** : `{% tabler_filled icon_name [size] [color] [size=value] [color=value] %}`

### Parameters

Liquid variables are supported for all arguments, including top-level names like `icon_name` or `brand-github` and dotted lookups like `page.icon_name`.Optional parameters can be passed as named arguments like `size=32` and `color=red` in any order.

1. `icon_name`(Required) : Name of the [Tabler Icons](https://tabler.io/icons), must be first place after liquid tag name.
   `icon_name` can find at search bar of <https://tabler.io/icons>.
2. `size`(Optional) : Width and Height of SVG default to `24`.
3. `color`(Optional) : Color of `fill` for filled SVG and `stroke` for outline SVG , default `currentColor`

### Example

- **Github outline icon**

  With default size and color

  ```liquid
  {% tabler ti-brand-github %}
  ```

  With custom size and color

  ```liquid
  {% tabler ti-brand-github size=36 color=#673ab8 %}
  ```

- **Github filled icon**

  With default size and color

  ```liquid
  {% tabler_filled ti-brand-github %}
  ```

  With custom size and color

  ```liquid
  {% tabler_filled ti-brand-github size=36 color=#673ab8 %}
  ```

### Getting Liquid tag

You can search for icon Liquid tags, adjust the size or color, and copy the result from <https://phothinmg.github.io/jekyll-tabler/>.

## Performance note for older versions

Released versions up to `0.1.2` are affected by the [uncached `YAML.load_file` issue](https://github.com/phothinmg/jekyll-tabler/issues/2).
If you use this plugin together with page-generating plugins such as `jekyll-paginate-v2` autopages, every `{% tabler %}` and `{% tabler_filled %}` render triggers a full disk read and YAML parse of the icon data files.
On sites with many generated pages, that repeated work can noticeably slow down builds.

If you are using one of those released versions, add the following workaround in your site's `_plugins` directory. This patch was suggested by [Sri Harsha Chilakapati](https://github.com/sriharshachilakapati).

`_plugins/tabler_cache.rb`

```ruby
# frozen_string_literal: true

# Monkey-patch jekyll-tabler to cache YAML icon data.
# The original `tabler_icons` method calls YAML.load_file on every render,
# re-reading and re-parsing a 956KB file each time. This caches the result
# so each file is loaded exactly once per build.

module Jekyll
  module Tabler
    @tabler_icon_data = {}

    def self.tabler_icons(type)
      @tabler_icon_data[type] ||= begin
        data_path = File.join(
          Gem.loaded_specs["jekyll-tabler"].full_gem_path,
          "assets",
          "#{type}.yml"
        )
        YAML.load_file(data_path)
      end
    end
  end
end
```

## Contributing

Bug reports and pull requests are welcome on GitHub at <https://github.com/[USERNAME]/jekyll-tabler>. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/[USERNAME]/jekyll-tabler/blob/master/CODE_OF_CONDUCT.md).

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Jekyll::Tabler project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/[USERNAME]/jekyll-tabler/blob/master/CODE_OF_CONDUCT.md).
