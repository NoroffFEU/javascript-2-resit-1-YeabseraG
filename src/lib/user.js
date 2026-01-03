import { LS_USER } from "./constants.js";
import { load, save } from "./storage.js";

export function getUser() {
  return load(LS_USER);
}

export function setUser(userData) {
  save(LS_USER, userData);
}

export function clearUser() {
  localStorage.removeItem(LS_USER);
}
