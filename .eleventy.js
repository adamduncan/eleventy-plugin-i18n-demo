const i18n = require('./src/_11ty/shortcodes/i18n.js');
const dictionaries = require('./src/_data/i18n');

module.exports = function (eleventyConfig) {
  // Filters
  // We'll be able to replace this with addPlugin() once eleventy-plugin-i18n is published
  eleventyConfig.addFilter('i18n', function (term, locale) {
    // Here we need to determine if filter is being used on page, or in include, respectively
    const page = this.page || this.ctx.page;
    return i18n(
      term,
      locale,
      {
        dictionaries,
        fallbackLocale: 'en-GB'
      },
      page
    );
  });

  // TEMP demo of what could be an i18n-aware plural package?
  eleventyConfig.addFilter('pluralize', function (term, count = 1) {
    // Poorman's pluralize for now...
    return count === 1 ? term : `${term}s`;
  });

  // Browsersync
  // Redirect from root to default language root during --serve
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware('*', (req, res) => {
          if (req.url === '/') {
            res.writeHead(302, {
              location: '/en-GB/'
            });
            res.end();
          }
        });
      }
    }
  });

  // Configuration
  return {
    dir: {
      input: 'src'
    },
    markdownTemplateEngine: 'njk'
  };
};
