'use strict';

// TEMP plugin proof of concept!
// This file is what will go off and become eleventy-plugin-i18n...
const chalk = require('chalk');
const get = require('lodash.get');

module.exports = function (term, desiredLocale, options = {}, page = {}) {
  const {
    dictionaries = {},
    fallbackLocale: fallbackLocale = 'en-GB'
  } = options;

  // Use explicit `locale` argument if passed in, otherwise infer it from URL prefix segment
  const contextLocale = desiredLocale || page.url.split('/')[1];
  const locale = contextLocale;

  // Preferred translation
  const translation = get(dictionaries, `[${term}][${locale}]`);

  if (translation !== undefined) {
    return translation;
  } else {
    console.warn(
      chalk.yellow(
        `Warning: Could not find i18n translation for '${term}' in locale: ${contextLocale}. Using fallback.`
      )
    );
  }

  // Fallback translation
  const fallbackTranslation = get(dictionaries, `[${term}][${fallbackLocale}]`);

  if (fallbackTranslation !== undefined) {
    return fallbackTranslation;
  } else {
    console.warn(
      chalk.red(
        `Not found: Could not find i18n translation for '${term}' in fallback locale: ${fallbackLocale}.`
      )
    );
    return term;
  }
};
