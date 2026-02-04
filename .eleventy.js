const markdownIt = require("markdown-it");
const fs = require("fs");

module.exports = function (eleventyConfig) {
  //site is served at: https://miriamfullerug.github.io/an-cumann-rince-seite/
  eleventyConfig.setPathPrefix("/an-cumann-rince-seite/");

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/images");

  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  });

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addFilter("markdown", function (content) {
    if (!content) return "";
    return md.render(content);
  });

  eleventyConfig.addGlobalData("eleventyComputed", {
    parsedSet: function (data) {
      if (!data.page || !data.page.inputPath) return null;
      if (
        !data.page.inputPath.includes("/sets/") ||
        !data.page.inputPath.endsWith(".md")
      ) {
        return null;
      }

      const filePath = data.page.inputPath;
      let rawContent;
      try {
        rawContent = fs.readFileSync(filePath, "utf-8");
      } catch (e) {
        return null;
      }

      const frontmatterMatch = rawContent.match(
        /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
      );
      if (!frontmatterMatch) return null;

      const markdownContent = frontmatterMatch[2];
      return parseSetContent(markdownContent, md);
    },
  });

  return {
    pathPrefix: "/an-cumann-rince-seite/",
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};

function parseSetContent(content, md) {
  if (!content) return { intro: "", figures: [] };

  const lines = content.split("\n");
  let intro = [];
  let figures = [];
  let currentFigure = null;
  let inIntro = true;
  let introEnded = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for figure heading: **Figiúr N – Name**
    const figureMatch = trimmed.match(
      /^\*\*Figiúr\s+(\d+)\s*[–-]\s*(.+?)\*\*$/
    );

    if (figureMatch) {
      inIntro = false;
      introEnded = true;

      if (currentFigure) {
        figures.push(currentFigure);
      }

      currentFigure = {
        number: figureMatch[1],
        name: figureMatch[2],
        tuneType: null,
        bars: null,
        video: null,
        content: [],
      };
      continue;
    }

    // Skip --- separators
    if (trimmed === "---") {
      if (inIntro && intro.length > 0) {
        introEnded = true;
      }
      continue;
    }

    // Skip H1 title
    if (trimmed.startsWith("# ")) {
      continue;
    }

    if (!introEnded && inIntro) {
      if (trimmed.length > 0) {
        intro.push(line);
      }
    } else if (currentFigure) {
      // Check for music info line: *ríleanna – 160 barra*
      const musicMatch = trimmed.match(
        /^\*([^*]+)\s*[–-]\s*(\d+)\s*barra\*$/
      );
      if (musicMatch) {
        currentFigure.tuneType = musicMatch[1].trim();
        currentFigure.bars = parseInt(musicMatch[2], 10);
        continue;
      }

      // Check for video line: @físeán: URL
      const videoMatch = trimmed.match(/^@físeán:\s*(.+)$/);
      if (videoMatch) {
        currentFigure.video = videoMatch[1].trim();
        continue;
      }

      currentFigure.content.push(line);
    }
  }

  if (currentFigure) {
    figures.push(currentFigure);
  }

  // Process figure content into HTML
  figures = figures.map((fig) => {
    const contentHtml = processContent(fig.content, md);
    return {
      number: fig.number,
      name: fig.name,
      tuneType: fig.tuneType,
      bars: fig.bars,
      video: fig.video,
      contentHtml: contentHtml,
    };
  });

  return {
    intro: intro.join("\n"),
    introHtml: md.render(intro.join("\n")),
    figures: figures,
  };
}

function processContent(lines, md) {
  let content = lines.join("\n").trim();
  let html = md.render(content);

  // Add section-label class to strong tags containing key words
  html = html.replace(
    /<strong>([^<]*(?:Barranna|Taobhanna|Gach duine|Fir|Mná)[^<]*)<\/strong>/g,
    '<strong class="section-label">$1</strong>'
  );

  html = html.replace(/<ul>/g, '<ul class="figure-list">');

  return html;
}
