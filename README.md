<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->
<p align="center">
<img src="https://susee.phothin.dev/logo/rubygems_logo.png" width="160" height="160" alt="rubygems" style="border-radius:50%" />
</p>
<h1 align="center">Jekyll::Tabler</h1>

## Overview

[Tabler Icons](https://tabler.io/icons) plugin for Jekyll site as liquid tag.

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

Liquid variables are supported for all arguments, including top-level names like `icon_name` or `github` and dotted lookups like `page.icon_name`.Optional parameters can be passed as named arguments like `size=32` and `color=red` in any order.

1. `icon_name`(Required) : Name of the [Tabler Icons](https://tabler.io/icons), must be first place after liquid tag name.
2. `size`(Optional) : Width and Height of SVG default to `24`.
3. `color`(Optional) : Color of `fill` for filled SVG and `stroke` for outline SVG , default `currentColor`

### Example

- **Github outline icon**

  With default size and color

  ```liquid
  {% tabler brand-github %}
  ```

  With custom size and color

  ```liquid
  {% tabler brand-github size=36 color=#673ab8 %}
  ```

- **Github filled icon**

  With default size and color

  ```liquid
  {% tabler_filled brand-github %}
  ```

  With custom size and color

  ```liquid
  {% tabler_filled brand-github size=36 color=#673ab8 %}
  ```

## Contributing

Bug reports and pull requests are welcome on GitHub at <https://github.com/[USERNAME]/jekyll-tabler>. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/[USERNAME]/jekyll-tabler/blob/master/CODE_OF_CONDUCT.md).

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Jekyll::Tabler project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/[USERNAME]/jekyll-tabler/blob/master/CODE_OF_CONDUCT.md).
