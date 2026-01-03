import { loginUser } from "../lib/auth.js";

const form = document.querySelector("#form");
const msg = document.querySelector("#msg");
const submitBtn = document.querySelector("#submit");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  submitBtn.disabled = true;

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  try {
    await loginUser({ email, password });
    msg.textContent = "Logged in! Redirecting to profile…";
    setTimeout(() => (location.href = "./profile.html"), 700);
  } catch (err) {
    msg.textContent = err.message || "Login failed.";
    msg.classList.add("error");
  } finally {
    submitBtn.disabled = false;
  }
});
