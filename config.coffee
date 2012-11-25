exports.config =
  # Edit the next line to change default build path.
  paths:
    public: 'public'
    compass: './compass.rb'

  files:
    javascripts:
      # Defines what file will be generated with `brunch generate`.
      defaultExtension: 'js'
      # Describes how files will be compiled & joined together.
      # Available formats:
      # * 'outputFilePath'
      # * map of ('outputFilePath': /regExp that matches input path/)
      # * map of ('outputFilePath': function that takes input path)
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
      # Defines compilation order.
      # `vendor` files will be compiled before other ones
      # even if they are not present here.
      order:
        before: [
          'vendor/scripts/jquery-1.8.3.js',
          'vendor/scripts/lodash.custom.js',
          'vendor/scripts/backbone.js',
          'vendor/scripts/backbone-mediator.js',
          'vendor/scripts/spin.js'
        ]

    templates:
      defaultExtension: 'dust'
      joinTo: 'javascripts/app.js'