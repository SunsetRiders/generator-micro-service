const generateCurl = function(method, headers, body, uri) {
  // Sanity
  if (!method) {
    throw new Error('Parameter method seems to be null');
  }

  if (!uri) {
    throw new Error('Parameter uri seems to be null');
  }

  method = method.toUpperCase();

  let curlLine = 'curl ';

  if (method === 'HEAD') {
    curlLine += '--head ';
  } else {
    curlLine += '-X ' + method;
  }

  curlLine +=  ' -H "Content-Type: application/json"';

  for (let header in headers) {
    if (!headers.hasOwnProperty(header)) {
      continue;
    }

    curlLine += ' -H "' + header + ': ' + headers[header] + '"';
  }

  if (body) {
    /* eslint-disable */
    curlLine += " --data '" + JSON.stringify(body) + "'";
    /* eslint-enable */
  }

  curlLine += ' ' + uri;

  return curlLine;
};

module.exports = generateCurl;
