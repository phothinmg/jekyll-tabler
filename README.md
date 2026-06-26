<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->
<p align="center">
<img src="https://susee.phothin.dev/logo/rubygems_logo.png" width="160" height="160" alt="mmdevs" style="border-radius:50%" />
</p>
<h1 align="center">Jekyll::Tabler</h1>

[Tabler Icons](https://tabler.io/icons) plugin for Jekyll site as liquid tag.

## Installation

Install the gem and add to the application's Gemfile by executing:

```sh
bundle add jekyll-tabler
```

If bundler is not being used to manage dependencies, install the gem by executing:

```bash
gem install jekyll-tabler
```

## Usage

Register the plugin in your Jekyll site and render icons with the `tabler` Liquid tag:

```ruby
plugins:
 - jekyll-tabler
```

```liquid
{% tabler alarm %}
{% tabler alarm 32 %}
{% tabler alarm 32 red %}
{% tabler alarm size=32 %}
{% tabler alarm color=red %}
{% tabler alarm color=red size=32 %}
{% assign icon_name = foo.icon %}
{% tabler icon_name 32 red %}
{% tabler github 32 red %}
{% tabler page.icon_name size=page.icon_size color=page.icon_color %}
{% tabler page.icon_name 32 page.icon_color %}
```

Parameters:

- `icon_name` is required.
- `size` is optional and defaults to `24`.
- `color` is optional and defaults to `currentColor`.
- Optional parameters can be passed as named arguments like `size=32` and `color=red` in any order.
- `color` is optional and defaults to `currentColor`.
- Liquid variables are supported for all arguments, including top-level names like `icon_name` or `github` and dotted lookups like `page.icon_name`.

## Development

After checking out the repo, run `bin/setup` to install dependencies. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and the created tag, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/[USERNAME]/jekyll-tabler. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/[USERNAME]/jekyll-tabler/blob/master/CODE_OF_CONDUCT.md).

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Jekyll::Tabler project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/[USERNAME]/jekyll-tabler/blob/master/CODE_OF_CONDUCT.md).
