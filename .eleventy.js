const i18n = require('./src/_11ty/shortcodes/i18n.js');
const dictionaries = require('./src/_data/i18n');

module.exports = function (eleventyConfig) {
  // Shortcodes
  // We'll be able to replace this with addPlugin() once eleventy-plugin-i18n is published
  eleventyConfig.addShortcode('i18n', function (term, locale) {
    return i18n(
      term,
      locale,
      {
        dictionaries,
        fallbackLocale: 'en-gb'
      },
      this.page
    );
  });

  // Browsersync
  // Redirect from root to default language root during --serve
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware('*', (req, res) => {
          if (req.url === '/') {
            res.writeHead(302, {
              location: '/en-gb/'
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
    }
  };
};
