import { API_BASE } from "./constants.js";

/**
 * Fetch JSON from the API with support for method/body/headers.
 * @param {string} path API path starting with "/" e.g. "/old-games"
 * @param {RequestInit} [options]
 * @returns {Promise<any>} Parsed JSON response
 */
export async function fetchJson(path, options = {}) {
  const headers = new Headers(options.headers || {});
  // Only set JSON content-type if im sending a body
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.errors?.[0]?.message ||
      data?.message ||
      "Request failed";
    throw new Error(message);
  }

  return data;
}
