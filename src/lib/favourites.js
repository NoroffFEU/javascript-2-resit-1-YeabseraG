import { LS_FAVS } from "./constants.js";
import { load, save } from "./storage.js";

export function getFavourites() {
  return load(LS_FAVS) || [];
}

/**
 * Toggle a game id in favourites and persist to localStorage.
 * @param {number} gameId
 * @returns {boolean} true if now favourited
 */
export function toggleFavourite(gameId) {
  const favs = new Set(getFavourites());
  if (favs.has(gameId)) favs.delete(gameId);
  else favs.add(gameId);

  save(LS_FAVS, [...favs]);
  return favs.has(gameId);
}

export function isFavourited(gameId) {
  return new Set(getFavourites()).has(gameId);
}
