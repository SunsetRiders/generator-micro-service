const kebabCase = require('lodash').kebabCase;

/**
 * Formats the name to follow the pattern "something-service"
 *
 * @param {string} name the base name
 * @returns {string} name in kebab case suffixed with service
 */
function formatServiceName(name) {
  kebabedName = kebabCase(name);
  serviceStr = '-service';
  if (kebabedName.indexOf('service') >= 0) {
    return kebabedName;
  }
  return kebabedName + '-service';
}

module.exports = formatServiceName;
