import { FB_POST_SELECTOR1, FB_POST_SELECTOR2, FB_POST_SELECTOR3, FB_POST_SELECTOR4 } from './app';
import { getTimeISO8601, normalizeUrl } from './utils';

// TODO: in order to extract the visibility of a post,
// we analyze the last word in the "aria-label" of the post itself.
// This part should be improved because there might be some really
// weird corner cases, for example if someone's first name is one
// of the `publicWords`, then we might detect a wrong visibility.
// See #42.
var publicWords = [
    'public',       // Français, Română, English,
    'öffentlich',   // Deutsch
    'offentlig',    // Norsk (bokmål)
    'verejné',      // Slovenčina
    'público',      // Espanol
    'tutti',        // Italiano
    'público',      // Português
    'openbaar',     // 'Nederlands',
    'ledereen'      // 'Nederlands (België)'
];

export function scrape (elem) {
    // Skip if the post is not top level
    if ( elem.parents(FB_POST_SELECTOR1).length /* ||
         elem.parents(FB_POST_SELECTOR2).length ||
         elem.parents(FB_POST_SELECTOR3).length ||
         elem.parents(FB_POST_SELECTOR4).length */ ) {
        return null;
    }

    var sharingLevel = elem
      .find('[data-hover="tooltip"][role][aria-label][data-tooltip-content]')
      .attr('aria-label')
      .trim()
      .split(' ')
      .pop()
      .toLowerCase();

    console.log("Extracted sharingLevel:", sharingLevel);

    var visibility = publicWords.indexOf(sharingLevel) !== -1 ? 'public' : 'private';

    return {
        visibility: visibility,
        /* this can be enabled whenever we're debugging languages */
        /* visibilityInfo: sharingLevel, */
        impressionTime: getTimeISO8601()
    };
}

export function scrapePermalink (elem) {
    // If the user doesn't have a vanity URL, then the link to the post will
    // start with `permalink.php...`. If the user **has** a vanity URL, then the
    // link will be `<username>/posts/...`.
    var permalink = elem.find('[href^="/permalink.php"]').attr('href') ||
                    elem.find('[href*="/posts/"]').attr('href');
    return normalizeUrl(permalink);
}
