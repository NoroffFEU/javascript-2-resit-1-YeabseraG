import { getUser, clearUser } from "../lib/user.js";
import { getFavourites, isFavourited, toggleFavourite } from "../lib/favourites.js";
import { fetchJson } from "../lib/api.js";

const errorEl = document.querySelector("#error");
const profileBox = document.querySelector("#profileBox");
const grid = document.querySelector("#grid");
const statusEl = document.querySelector("#status");
const logoutBtn = document.querySelector("#logoutBtn");

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeGame(raw) {
  return {
    id: raw.id,
    name: raw.name ?? "Untitled",
    released: raw.released ?? null,
    image: raw.image?.url ?? raw.image ?? "",
    genre: Array.isArray(raw.genre) ? raw.genre : (raw.genre ? [raw.genre] : []),
  };
}

function renderProfile(user) {
  profileBox.style.display = "block";
  logoutBtn.style.display = "inline-block";

  const name = user?.name ?? "(no name)";
  const email = user?.email ?? "(no email)";

  profileBox.innerHTML = `
    <p style="margin:0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p class="small" style="margin:6px 0 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
  `;
}

function renderFavourites(games) {
  grid.innerHTML = "";

  if (!games.length) {
    grid.innerHTML = `<div class="panel"><p class="small">No favourites yet. Go to <a href="./index.html">Home</a> and favourite some games.</p></div>`;
    return;
  }

  for (const game of games) {
    const detailsUrl = `./game.html?id=${encodeURIComponent(game.id)}`;
    const fav = isFavourited(game.id);

    const imgHtml = game.image
      ? `<a href="${detailsUrl}">
           <img src="${game.image}" alt="${escapeHtml(game.name)}" />
         </a>`
      : `<a href="${detailsUrl}">
           <div style="height:160px;background:#0c0f1c;border-bottom:1px solid var(--border);"></div>
         </a>`;

    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      ${imgHtml}
      <div class="card-body">
        <div class="row">
          <a href="${detailsUrl}" style="font-weight:700;">
            ${escapeHtml(game.name)}
          </a>
          <span class="small">${game.released ?? ""}</span>
        </div>

        <div class="badges">
          ${game.genre.slice(0, 4).map(g => `
            <a class="badge" href="./genre.html?g=${encodeURIComponent(g)}">${escapeHtml(g)}</a>
          `).join("")}
        </div>

        <div class="row">
          <a class="badge" href="${detailsUrl}">Details</a>
          <button class="${fav ? "primary" : ""}" data-fav="${game.id}">
            ${fav ? "★ Favourited" : "☆ Favourite"}
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  }
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-fav]");
  if (!btn) return;

  const id = Number(btn.dataset.fav);
  const nowFav = toggleFavourite(id);

  btn.classList.toggle("primary", nowFav);
  btn.textContent = nowFav ? "★ Favourited" : "☆ Favourite";

  // If user unfavourites on profile page, it will remove the card immediately
  if (!nowFav) {
    btn.closest(".card")?.remove();
    const remaining = grid.querySelectorAll(".card").length;
    statusEl.textContent = `${remaining} favourite(s)`;
    if (remaining === 0) renderFavourites([]);
  }
});

logoutBtn.addEventListener("click", () => {
  clearUser();
  location.href = "./login.html";
});

async function init() {
  const user = getUser();

  if (!user) {
    errorEl.textContent = "You are not logged in. Please login to view your profile.";
    statusEl.textContent = "";
    grid.innerHTML = `<div class="panel"><p class="small"><a href="./login.html">Go to login</a></p></div>`;
    return;
  }

  renderProfile(user);

  const favIds = getFavourites();
  if (!favIds.length) {
    statusEl.textContent = "0 favourite(s)";
    renderFavourites([]);
    return;
  }

  try {
    statusEl.textContent = "Loading…";
    // simplest: fetch all games once, filter by fav IDs
    const favGames = await Promise.all(
  favIds.map(async (favId) => {
    const res = await fetchJson(`/old-games/${favId}`);
    return normalizeGame(res.data);
  })
);

   statusEl.textContent = `${favGames.length} favourite(s)`;
   renderFavourites(favGames);

  } catch (err) {
    errorEl.textContent = err.message || "Failed to load favourites.";
    statusEl.textContent = "";
  }
}

init();
