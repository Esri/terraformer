###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
# activate :livereload

# Methods defined in the helpers block are available in templates
# helpers do
#   def table_of_contents
#     TableOfContentsRenderer
#     current_page.soruce.render()
#   end
# end

module CustomRenderers
  class SemanticTOC < Redcarpet::Render::HTML_TOC
    def preprocess text
      @current_level = 0
      text
    end

    def header text, level
      if level > 1
        buf = ""

        if (@current_level == 0)
          @level_offset = level - 1;
        end

        level -= @level_offset

        if (level > @current_level)
          while (level > @current_level)
            buf << "<ol><li>"
            @current_level += 1
          end
        elsif (level < @current_level)
          buf << "</li>"
          while (level < @current_level)
            buf << "</ol></li>"
            @current_level -= 1
          end
          buf << "<li>"
        else
          buf << "</li><li>"
        end

        buf << "<a href='##{text.downcase.strip.gsub(' ', '-').gsub(/\(.+\)/, '').gsub(/[^\w-]/, '')}'>#{text}</a>"
      end
    end

    def postprocess text
      "<div class='semantic-toc'>#{text}</div>\n\n"
    end
  end

  class Markdown < Redcarpet::Render::HTML

    TableOfContentsRenderer = ::Redcarpet::Markdown.new(CustomRenderers::SemanticTOC)

    include Redcarpet::Render::SmartyPants

    def preprocess text
      toc = TableOfContentsRenderer.render text
      text.gsub!("<!-- table_of_contents -->", toc)
      return text
    end

    def header text, level
      if level > 1
        id = text.downcase.strip.gsub(' ', '-').gsub(/\(.+\)/, '').gsub(/[^\w-]/, '')
        puts id
        "<h#{level}>
          <a id='#{id}' class='section-link'></a>
          <a href='##{id}' class='header-link'>Link</a>
          #{text}
          <a href='#' class='back-to-top-link'>Back to Top</a>
        </h#{level}>"
      else
        "<h#{level}>#{text}</h#{level}>"
      end
    end

  end
end

activate :directory_indexes

set :css_dir, 'assets/css'

set :js_dir, 'assets/javascripts'

set :images_dir, 'assets/images'

set :fonts_dir,'assets/fonts'

set :index_file, "index.html"

# set :http_prefix, 'documentation/'
###
# Markdown
###

set :markdown_engine, :redcarpet
set :markdown,
    :renderer => CustomRenderers::Markdown,
    :fenced_code_blocks => true,
    :tables => true,
    :no_intra_emphasis => true,
    :strikethrough => true,
    :superscript => true,
    :highlight => true,
    :footnotes => true,
    :autolink => true,
    :with_toc_data => true

activate :rouge_syntax

# Documentation TOC
def get_pages
  @pages = sitemap.resources.find_all { |page| page.url.match(/\/documentation\/.*/) }
  # Sort by date of project
  # @projects.sort! { |a,b| a.data['order'].to_i <=> b.data['order'].to_i }
end

ready do
  get_pages
end

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end
