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
  activate :minify_css

  activate :minify_javascript

  activate :asset_hash
end
