
/**
 * validateGitUri perform a sanity check on the uri
 *
 * @param {string} uri to be checked
 * @return {bool} valid?
 */
function validateGitUri(uri) {
  return str.indexOf('git') === 0 ||
    str.indexOf('http') === 0;
}

module.exports = validateGitUri;
