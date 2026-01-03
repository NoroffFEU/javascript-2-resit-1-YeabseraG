import { fetchJson } from "./api.js";
import { setUser } from "./user.js";

/**
 * Register a new Noroff user.
 * Note: Noroff may require a @stud.noroff.no email depending on course rules.
 */
export async function registerUser({ name, email, password }) {
  return fetchJson("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

/**
 * Login and store user session (accessToken etc.).
 */
export async function loginUser({ email, password }) {
  const res = await fetchJson("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // res.data typically includes accessToken and user fields
  setUser(res.data);
  return res.data;
}
