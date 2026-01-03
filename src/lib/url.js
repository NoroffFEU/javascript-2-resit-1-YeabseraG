/**
 * Get a query param from the current URL.
 * @param {string} key
 * @returns {string|null}
 */
export function getQueryParam(key) {
  return new URLSearchParams(location.search).get(key);
}
