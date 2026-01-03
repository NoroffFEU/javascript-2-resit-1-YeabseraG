import { getUser, clearUser } from "./user.js";

export function initNav() {
  const box = document.querySelector("#authLinks");
  if (!box) return;

  const user = getUser();

  if (user?.accessToken) {
    box.innerHTML = `
      <span class="small">Hi, ${user.name ?? "user"}</span>
      <a href="./profile.html">Profile</a>
      <button id="navLogout" style="max-width:140px;">Logout</button>
    `;

    document.querySelector("#navLogout")?.addEventListener("click", () => {
      clearUser();
      location.href = "./login.html";
    });
  } else {
    box.innerHTML = `
      <a href="./login.html">Login</a>
      <a href="./register.html">Register</a>
    `;
  }
}
