// Variables
export const backendOrigin = process.env.REACT_APP_BACKEND_URI;

/**
 * Parses the current window location and returns the result in an object.
 *
 * @returns {object} An object with attributes 'location', 'parameters', 'path', and 'hash'.
 */
export function getLocation() {
  let location = window.location;

  // Get query parameters
  let parametersArray = location.search
    .substring(1, location.search.length + 1)
    .split("&");
  let parameters = {};
  for (const index in parametersArray) {
    let parameterArray = parametersArray[index].split("=");
    parameters[parameterArray[0]] =
      parameterArray.length === 2 ? parameterArray[1] : null;
  }

  // Get path
  let path = location.pathname.split("/");

  // Get hash
  let hash = location.hash.substring(1, location.hash.length + 1);

  return { location: location, parameters: parameters, path: path, hash: hash };
}

/**
 * Returns 'true' if the URL path of the current page contains the provided string.
 *
 * @param {string} pathString The string to search for in the path.
 * @returns {boolean} 'true' if 'pathString' is in the path.
 */
export function inPath(pathString) {
  let location = getLocation();
  return location.path.indexOf(pathString) !== -1;
}

/**
 * Change the document location to the provided relative URL path.
 *
 * @param {string} pathString The URL path to navigate to.
 */
export function navigateTo(pathString) {
  document.location.href = pathString;
}
