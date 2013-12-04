module CustomRenderers
  class SemanticTOC < Redcarpet::Render::HTML_TOC


    def preprocess text
      @current_level = 0
      @headers = []
      text
    end

    def header text, level

      id = text.downcase.strip.gsub(' ', '-').gsub(/\(.+\)/, '').gsub(/[^\w-]/, '')

      if(@headers.include?(id))
        while @headers.include?(id) do
          if id[-1].to_i.zero?
            id = id + "-1"
          else
            id[-1] = (id[-1].to_i + 1).to_s
          end

          if !@headers.include?(id)
            @headers.push(id)
            break
          end
        end
      else
        @headers.push(id)
      end

      buf = ""

      if level > 1 && level < 5

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

        buf << "<a href='##{id}'>#{text}</a>"
      end
      buf
    end

    def postprocess text
      "<div class='semantic-toc'>#{text}</div>\n\n"
    end
  end

  class Markdown < Redcarpet::Render::HTML


    TableOfContentsRenderer = ::Redcarpet::Markdown.new(CustomRenderers::SemanticTOC)

    include Redcarpet::Render::SmartyPants

    def preprocess text
      @headers = []
      toc = TableOfContentsRenderer.render text
      text.gsub!("<!-- table_of_contents -->", toc)
      return text
    end

    def header text, level
      if level > 1 && level < 5
        id = text.downcase.strip.gsub(' ', '-').gsub(/\(.+\)/, '').gsub(/[^\w-]/, '')

        if(@headers.include?(id))
          while @headers.include?(id) do
            if id[-1].to_i.zero?
              id = id + "-1"
            else
              id[-1] = (id[-1].to_i + 1).to_s
            end

            if !@headers.include?(id)
              @headers.push(id)
              break
            end
          end
        else
          @headers.push(id)
        end

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

set :index_file, 'index.html'

set :markdown_engine, :redcarpet

set :source, 'docs'

set :build_dir, 'docs-build'

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

# Build-specific configuration
configure :build do
  activate :minify_css

  activate :minify_javascript

  activate :asset_hash
end