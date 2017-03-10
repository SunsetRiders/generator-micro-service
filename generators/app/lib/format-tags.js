/**
 * formatTags formats a "tag1, tag with spaces, tag2" into
 * ["tag1","tag-with-spaces","tag2"]
 *
 * @param {string} tagsString to be formatted
 * @return {string[]} formated tags
 */
function formatTags(tagsString) {
  tagStr = tagsString || '';
  return tagStr.split(',').map((tag) => tag.replace(/\s/g, '-'));
}

module.exports = formatTags;
