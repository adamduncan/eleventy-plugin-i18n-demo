# eleventy-plugin-i18n-demo

Demo site for [`eleventy-plugin-i18n`](https://github.com/adamduncan/eleventy-plugin-i18n).

## Goal

- [x] Leverage Eleventy's data cascade to build a clever, language-aware `{{ 'hello' | i18n }}` filter, backed by multilingual dictionary translations.
- [x] Package the filter up into a plugin, so can be easily configured and used in any Eleventy site.
- [x] Add a `data` argument and interpolate values into the translations: `{ 'hello_name': 'Hello, {{ name }}!' }`
- [ ] Write up tutorial to build on some great concepts ([multilingual](https://www.webstoemp.com/blog/multilingual-sites-eleventy/), [language toggle](https://www.webstoemp.com/blog/language-switcher-multilingual-jamstack-sites/)) in this area. Dive further into how to architect and implement multilingual Eleventy sites, and leverage the plugin (e.g. [smart language switching](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_includes/components/language-selector.njk)).
- [ ] Explore shipping additional `pluralize` filter for i18n usage `{{ 'hello' | i18n | pluralize(3) }}` (Awesome suggestion from [@alexcarpenter](https://github.com/alexcarpenter)).

## TL;DR just riffin'

- We start with logical [country-code directories for the site `src`](https://github.com/adamduncan/eleventy-plugin-i18n-demo/tree/master/src) (`/en` or `/en-GB`). Country codes or country codes with language suffixes (if we're talking dialects) are both fair game.
- Set [country-specific locale data](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/en-gb/en-gb.json) in each language directory. This data is used deeper in the country sites' cascade, as well as at the [document level for `lang` and `dir` attributes](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_includes/layouts/base.njk#L2).
- As we maintain independent site trees per language, the guts of the content pages will likely be written in their respective languages. But;
- With "UI text" though, in layouts, forms, and reusable components we often find ourselves hard-coding little chunks of copy throughout. What if we lift these out into a structured [dictionary of terms and translations](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_data/i18n/index.js)? (We could also break this down into any number/schema of dictionary files per language.)
- Then we give ourselves a clever [`i18n` filter](https://github.com/adamduncan/eleventy-plugin-i18n/blob/master/i18n.js) to play with:
  - This takes a `key` to look up in the dictionary. It [uses](https://github.com/adamduncan/eleventy-plugin-i18n/blob/master/i18n.js#L25) `lodash.get`-style dot notation to support structured dictionary objects. E.g. [`{{ 'actions.click' | i18n }}`](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_data/i18n/index.js#L39-L50) :sunglasses:
  - Under the hood, the `i18n` function will be clever enough to [infer its language "scope"](https://github.com/adamduncan/eleventy-plugin-i18n/blob/master/i18n.js#L22) based on `page.url` language prefix.
  - We can interpolate values from a data object, by passing it as the first argument: `{{ 'hello_name' | i18n({ name: 'Eve' }) }}`.
  - To override page `locale`, we can pass a language code as the second argument: `{{ 'hello' | i18n({}, 'fr-FR') }}`. (_Note:_ we still pass an empty data object—or `undefined`—here if no interpolation is needed).
  - If a dictionary lookup can't be found, we can also set [`fallbackLocales`](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/.eleventy.js#L8-L10) via plugin options. This key/value maps lanaguages to their fallbacks. E.g. `{ 'en-US': 'en-GB' }` or use a wildcard to catch all `{ '*': 'en-GB' }`. Let's [warn the user](https://github.com/adamduncan/eleventy-plugin-i18n/blob/master/i18n.js#L37-L41) in the console when fallbacks are used.
  - If neither a translation _nor_ its fallback can be found, let's return the original `key` and [really warn the user](https://github.com/adamduncan/eleventy-plugin-i18n/blob/master/i18n.js#L46-L50) that something's definitely lost in translation.
- One more thing: Because we know about our [`locales.json`](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_data/locales.js) up front, and our site is structured predictably, we can easily create a smart [language-switcher](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_includes/components/language-selector.njk) component. This will automatically link you through to the correct page in each respective language based on the page you're on. No extra front matter or permalinking required. :kissing:

P.S. I've naively taken [translations here](https://github.com/adamduncan/eleventy-plugin-i18n-demo/blob/master/src/_data/i18n/index.js) from Google translate. I'm sure they're wrong, but would love to get them right! If you speak Spanish or Arabic and can correct me, I'd love for you to reach out: [@duncanadam](https://twitter.com/duncanadam).
