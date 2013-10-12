require 'tilt/template'

module Hamlbars
  class Template < Tilt::Template
    if defined? Rails
      include Ext::RailsHelper
    end

    self.default_mime_type = 'text/x-handlebars'

    def self.engine_initialized?
      defined? ::Haml::Engine
    end

    def initialize_engine
      require_template_library 'haml'
    end

    def prepare
      options = @options.merge(:filename => eval_file, :line => line)
      @engine = ::Haml::Engine.new(data, options)
    end

    # Uses Haml to render the template into an HTML string, then 
    # wraps it in the neccessary JavaScript to serve to the client.
    def evaluate(scope, locals, &block)
      if @engine.respond_to?(:precompiled_method_return_value, true)
        super(scope, locals, &block)
      else
        @engine.render(scope, locals, &block)
      end
    end

    private

    # Precompiled Haml source. Taken from the precompiled_with_ambles
    # method in Haml::Precompiler:
    # http://github.com/nex3/haml/blob/master/lib/haml/precompiler.rb#L111-126
    def precompiled_template(locals)
      @engine.precompiled
    end

    def precompiled_preamble(locals)
      local_assigns = super
      @engine.instance_eval do
        <<-RUBY
          begin
            extend Haml::Helpers
            _hamlout = @haml_buffer = Haml::Buffer.new(@haml_buffer, #{options_for_buffer.inspect})
            _erbout = _hamlout.buffer
            __in_erb_template = true
            _haml_locals = locals
        #{local_assigns}
        RUBY
      end
    end

    def precompiled_postamble(locals)
      @engine.instance_eval do
        <<-RUBY
        #{precompiled_method_return_value}
          ensure
            @haml_buffer = @haml_buffer.upper
          end
        RUBY
      end
    end
  end
end

module Haml
  module Helpers

    module HamlbarsExtensions
      # Used to create handlebars expressions within HAML,
      # if you pass a block then it will create a Handlebars
      # block helper (ie "{{#expression}}..{{/expression}}" 
      # otherwise it will create an expression 
      # (ie "{{expression}}").
      def handlebars(expression, options={}, &block)
        express(['{{','}}'],expression,options,&block)
      end
      alias hb handlebars

      # The same as #handlebars except that it outputs "triple-stash"
      # expressions, which means that Handlebars won't escape the output.
      def handlebars!(expression, options={}, &block)
        express(['{{{','}}}'],expression,options,&block)
      end
      alias hb! handlebars!

    private

      def make(expression, options)
        if options.any?
          expression << " " << options.map {|key, value| "#{key}=\"#{value}\"" }.join(' ')
        else
          expression
        end
      end

      def express(demarcation,expression,options={},&block)
        if block.respond_to? :call
          content = capture_haml(&block)
          output = "#{demarcation.first}##{make(expression, options)}#{demarcation.last}#{content.strip}#{demarcation.first}/#{expression.split(' ').first}#{demarcation.last}"
        else
          output = "#{demarcation.first}#{make(expression, options)}#{demarcation.last}"
        end

        output = Haml::Util.html_safe(output) if Haml::Util.rails_xss_safe?
        output
      end
    end

    include HamlbarsExtensions
  end
end

