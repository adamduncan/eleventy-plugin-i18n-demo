'use strict';

// TEMP plugin proof of concept!
// This file is what will go off and become eleventy-plugin-i18n...
const chalk = require('chalk');
const get = require('lodash.get');
const templite = require('templite');

module.exports = function (
  term,
  data = {},
  localeOverride,
  pluginOptions = {},
  page
) {
  const {
    dictionaries = {},
    fallbackLocale: fallbackLocale = 'en-GB'
  } = pluginOptions;

  // Use explicit `locale` argument if passed in, otherwise infer it from URL prefix segment
  const url = get(page, 'url', '');
  const contextLocale = localeOverride || url.split('/')[1];

  const locale = contextLocale || fallbackLocale;

  // Preferred translation
  const translation = get(dictionaries, `[${term}][${locale}]`);

  if (translation !== undefined) {
    return templite(translation, data);
  } else {
    console.warn(
      chalk.yellow(
        `Warning: Could not find i18n translation for '${term}' in '${contextLocale}' locale. Using fallback.`
      )
    );
  }

  // Fallback translation
  const fallbackTranslation = get(dictionaries, `[${term}][${fallbackLocale}]`);

  if (fallbackTranslation !== undefined) {
    return templite(fallbackTranslation, data);
  } else {
    console.warn(
      chalk.red(
        `Not found: Could not find i18n translation for '${term}' in '${fallbackLocale}' fallback locale.`
      )
    );
    return term;
  }
};
