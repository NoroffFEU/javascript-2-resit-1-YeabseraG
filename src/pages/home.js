import { fetchJson } from "../lib/api.js";
import { isFavourited, toggleFavourite } from "../lib/favourites.js";
import { initNav } from "../lib/nav.js";
initNav();


const grid = document.querySelector("#grid");
const searchInput = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");
const statusEl = document.querySelector("#status");
const errorEl = document.querySelector("#error");

let allGames = [];

function normalizeGame(raw) {
  // API returns { data: [...] }, and each item is a game object.
  return {
    id: raw.id,
    name: raw.name ?? "Untitled",
    released: raw.released ?? null,
    description: raw.description ?? "",
    image: raw.image?.url ?? raw.image ?? "",
    genre: Array.isArray(raw.genre) ? raw.genre : (raw.genre ? [raw.genre] : []),
  };
}

function filterGames(games, q) {
  const query = q.trim().toLowerCase();
  if (!query) return games;
  return games.filter(g => g.name.toLowerCase().includes(query));
}

function sortGames(games, sortValue) {
  const copy = [...games];
  if (sortValue === "name-asc") copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sortValue === "released-asc") copy.sort((a, b) => Number(a.released ?? 0) - Number(b.released ?? 0));
  if (sortValue === "released-desc") copy.sort((a, b) => Number(b.released ?? 0) - Number(a.released ?? 0));
  return copy;
}

function render(games) {
  grid.innerHTML = "";

  if (!games.length) {
    grid.innerHTML = `<div class="panel"><p class="small">No games match your search.</p></div>`;
    return;
  }

  for (const game of games) {
    const fav = isFavourited(game.id);

    const card = document.createElement("article");
    card.className = "card";

    const detailsUrl = `./game.html?id=${encodeURIComponent(game.id)}`;

    const imgHtml = game.image
    ? `<a href="${detailsUrl}">
       <img src="${game.image}" alt="${escapeHtml(game.name)}" />
     </a>`
    : `<a href="${detailsUrl}">
       <div style="height:160px;background:#0c0f1c;border-bottom:1px solid var(--border);"></div>
     </a>`;


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
          <a class="badge" href="./game.html?id=${encodeURIComponent(game.id)}">Details</a>
          <button class="${fav ? "primary" : ""}" data-fav="${game.id}">
            ${fav ? "★ Favourited" : "☆ Favourite"}
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function applyUI() {
  const filtered = filterGames(allGames, searchInput.value);
  const sorted = sortGames(filtered, sortSelect.value);
  statusEl.textContent = `${sorted.length} game(s)`;
  render(sorted);
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-fav]");
  if (!btn) return;

  const id = Number(btn.dataset.fav);
  const nowFav = toggleFavourite(id);
  btn.classList.toggle("primary", nowFav);
  btn.textContent = nowFav ? "★ Favourited" : "☆ Favourite";
});

searchInput.addEventListener("input", applyUI);
sortSelect.addEventListener("change", applyUI);

async function init() {
  try {
    errorEl.textContent = "";
    statusEl.textContent = "Loading…";

    const res = await fetchJson("/old-games");
    allGames = (res.data || []).map(normalizeGame);

    applyUI();
  } catch (err) {
    errorEl.textContent = err.message || "Something went wrong";
    statusEl.textContent = "";
  }
}

init();
