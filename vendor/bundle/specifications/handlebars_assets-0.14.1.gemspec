# -*- encoding: utf-8 -*-
# stub: handlebars_assets 0.14.1 ruby lib

Gem::Specification.new do |s|
  s.name = "handlebars_assets"
  s.version = "0.14.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Les Hill"]
  s.date = "2013-06-21"
  s.description = "Compile Handlebars templates in the Rails asset pipeline."
  s.email = ["leshill@gmail.com"]
  s.homepage = ""
  s.require_paths = ["lib"]
  s.rubyforge_project = "handlebars_assets"
  s.rubygems_version = "2.1.8"
  s.summary = "Compile Handlebars templates in the Rails asset pipeline."

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<execjs>, [">= 1.2.9"])
      s.add_runtime_dependency(%q<tilt>, [">= 0"])
      s.add_runtime_dependency(%q<sprockets>, [">= 2.0.3"])
      s.add_development_dependency(%q<debugger>, [">= 0"])
      s.add_development_dependency(%q<haml>, [">= 0"])
      s.add_development_dependency(%q<rake>, [">= 0"])
      s.add_development_dependency(%q<slim>, [">= 0"])
      s.add_development_dependency(%q<json>, ["~> 1.7.7"])
    else
      s.add_dependency(%q<execjs>, [">= 1.2.9"])
      s.add_dependency(%q<tilt>, [">= 0"])
      s.add_dependency(%q<sprockets>, [">= 2.0.3"])
      s.add_dependency(%q<debugger>, [">= 0"])
      s.add_dependency(%q<haml>, [">= 0"])
      s.add_dependency(%q<rake>, [">= 0"])
      s.add_dependency(%q<slim>, [">= 0"])
      s.add_dependency(%q<json>, ["~> 1.7.7"])
    end
  else
    s.add_dependency(%q<execjs>, [">= 1.2.9"])
    s.add_dependency(%q<tilt>, [">= 0"])
    s.add_dependency(%q<sprockets>, [">= 2.0.3"])
    s.add_dependency(%q<debugger>, [">= 0"])
    s.add_dependency(%q<haml>, [">= 0"])
    s.add_dependency(%q<rake>, [">= 0"])
    s.add_dependency(%q<slim>, [">= 0"])
    s.add_dependency(%q<json>, ["~> 1.7.7"])
  end
end
