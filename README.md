# eleventy-plugin-i18n-demo

Demo site for [`eleventy-plugin-i18n`](https://github.com/adamduncan/eleventy-plugin-i18n).

## Goal

- [x] Leverage Eleventy's data cascade to build a clever, language-aware `{% i18n 'hello' %}` shortcode, backed by multilingual dictionary translations.
- [ ] Package the shortcode up into a plugin, so can be easily configured and used in any Eleventy site.
- [ ] Write up tutorial to build on some great concepts ([multilingual](https://www.webstoemp.com/blog/multilingual-sites-eleventy/), [language toggle](https://www.webstoemp.com/blog/language-switcher-multilingual-jamstack-sites/)) in this area. Dive further into how to architect and implement multilingual Eleventy sites, and leverage the plugin (e.g. [smart language switching](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_includes/components/language-selector.njk)).

## TL;DR just riffin'

- We start with logical [country-code directories for the site `src`](https://github.com/adamduncan/eleventy-plugin-i18n-demo/tree/master/src) (`/en` or `/en-gb`). Country codes or country codes with language suffixes (if we're talking dialects) are both fair game.
- Set [country-specific locale data](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/en-gb/en-gb.json) in each language directory. This data is used deeper in the country sites' cascade, as well as at the [document level for `lang` and `dir` attributes](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_includes/layouts/base.njk#L2).
- As we maintain independent site trees per language, the guts of the content pages will likely be written in their respective languages. But;
- With "UI text" though, in layouts, forms, and reusable components we often find ourselves hard-coding little chunks of copy throughout. What if we lift these out into a structured [dictionary of terms and translations](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_data/i18n/index.js)? (We could also break this down into any number/schema of dictionary files per language.)
- Then we give ourselves a clever [`i18n` shortcode](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_11ty/shortcodes/i18n.js) to play with:
  - This takes a `term` (key) to look up in the dictionary. It [uses](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_11ty/shortcodes/i18n.js#L19) `lodash.get`-style dot notation to support structured dictionary objects. E.g. [`{% i18n 'actions.click' %}`](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_data/i18n/index.js#L31-L43) :sunglasses:
  - Under the hood, the `i18n` function will be clever enough to [infer its language "scope"](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_11ty/shortcodes/i18n.js#L15) based on `page.url` language prefix, but you can also pass it a language code if you want to override it: `{% i18n 'hello', 'fr-fr' %}`.
  - If a dictionary lookup can't be found, we can also set a [`fallbackLocale`](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/.eleventy.js#L13) via plugin options. Let's [warn the user](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_11ty/shortcodes/i18n.js#L24-L28) in the console when this happens.
  - If neither a translation _nor_ its fallback can be found, let's return the original `term` and [warn the user](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_11ty/shortcodes/i18n.js#L40-L44) something's definitely gone lost in translation.
- One more thing: Because we know about our [`locales.json`](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_data/locales.js) up front, and our site is structured predictably, we can easily create a smart [language-switcher](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_includes/components/language-selector.njk) component. This will automatically link you through to the correct page in each respective language based on the page you're on. No extra front matter or permalinking required. :kissing:
