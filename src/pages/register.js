import { registerUser } from "../lib/auth.js";

const form = document.querySelector("#form");
const msg = document.querySelector("#msg");
const submitBtn = document.querySelector("#submit");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  submitBtn.disabled = true;

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  try {
    await registerUser({ name, email, password });
    msg.textContent = "Registered! Redirecting to login…";
    setTimeout(() => (location.href = "./login.html"), 700);
  } catch (err) {
    msg.textContent = err.message || "Registration failed.";
    msg.classList.add("error");
  } finally {
    submitBtn.disabled = false;
  }
});
