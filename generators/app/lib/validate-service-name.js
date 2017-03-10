/**
 * Validates if serviceName ends with "service"
 *
 * @param {string} serviceName to be validated
 * @return {bool} valid?
 */
function validateServiceName(serviceName) {
  return (serviceName.length > '-service'.length) &&
    (serviceName.indexOf('service') === serviceName.length - 'service'.length);
};

module.exports = validateServiceName;
