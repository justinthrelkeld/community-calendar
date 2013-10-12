# -*- encoding: utf-8 -*-
# stub: hamlbars 2.0.1 ruby lib

Gem::Specification.new do |s|
  s.name = "hamlbars"
  s.version = "2.0.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["James Harton"]
  s.date = "2013-06-10"
  s.description = "Hamlbars allows you to write handlebars templates using the familiar Haml syntax."
  s.email = ["james@sociable.co.nz"]
  s.homepage = "https://github.com/jamesotron/hamlbars"
  s.post_install_message = "  DEPRECATION WARNING: Hamlbars 2.0 removes asset compilation!\n\n  Template compilation in Hamlbars was a major source of confusion and bugs\n  since roughly half of its users are using Handlebars.js in their apps and\n  the other half are using Handlebars as part of Ember.js.\n\n  Hamlbars now simply outputs the rendered HTML marked up with Handlebars\n  sections.  It is up to you to choose the Handlebars compiler that works\n  for you.\n\n  If you're using Ember.js I would suggest adding ember-rails to your\n  Gemfile.\n\n  If you're using Handlebars.js then I would suggest adding handlebars_assets\n  to your Gemfile.\n\n  For both of the above gems you may need to rename your templates to\n  `mytemplate.js.hbs.hamlbars` in order for the output of Hamlbars to be sent\n  into the correct compiler.\n\n  Thanks for using Hamlbars. You're awesome.\n  @jamesotron\n"
  s.require_paths = ["lib"]
  s.rubygems_version = "2.1.8"
  s.summary = "Extensions to Haml to allow creation of handlebars expressions."

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<haml>, [">= 0"])
      s.add_runtime_dependency(%q<sprockets>, [">= 0"])
      s.add_runtime_dependency(%q<tilt>, [">= 0"])
      s.add_runtime_dependency(%q<execjs>, [">= 1.2"])
      s.add_development_dependency(%q<rake>, [">= 0"])
      s.add_development_dependency(%q<rspec>, [">= 2.10.0"])
      s.add_development_dependency(%q<activesupport>, [">= 0"])
    else
      s.add_dependency(%q<haml>, [">= 0"])
      s.add_dependency(%q<sprockets>, [">= 0"])
      s.add_dependency(%q<tilt>, [">= 0"])
      s.add_dependency(%q<execjs>, [">= 1.2"])
      s.add_dependency(%q<rake>, [">= 0"])
      s.add_dependency(%q<rspec>, [">= 2.10.0"])
      s.add_dependency(%q<activesupport>, [">= 0"])
    end
  else
    s.add_dependency(%q<haml>, [">= 0"])
    s.add_dependency(%q<sprockets>, [">= 0"])
    s.add_dependency(%q<tilt>, [">= 0"])
    s.add_dependency(%q<execjs>, [">= 1.2"])
    s.add_dependency(%q<rake>, [">= 0"])
    s.add_dependency(%q<rspec>, [">= 2.10.0"])
    s.add_dependency(%q<activesupport>, [">= 0"])
  end
end
