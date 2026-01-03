import { fetchJson } from "../lib/api.js";
import { getQueryParam } from "../lib/url.js";
import { isFavourited, toggleFavourite } from "../lib/favourites.js";
import { initNav } from "../lib/nav.js";
initNav();


const grid = document.querySelector("#grid");
const heading = document.querySelector("#heading");
const statusEl = document.querySelector("#status");
const errorEl = document.querySelector("#error");

const genreParam = getQueryParam("g");

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

function gameHasGenre(game, g) {
  const wanted = g.trim().toLowerCase();
  return game.genre.some(x => String(x).toLowerCase() === wanted);
}

function render(games) {
  grid.innerHTML = "";

  if (!games.length) {
    grid.innerHTML = `<div class="panel"><p class="small">No games found for this genre.</p></div>`;
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
});

async function init() {
  if (!genreParam) {
    heading.textContent = "Genre";
    errorEl.textContent = "Missing genre in URL (expected ?g=GenreName).";
    return;
  }

  try {
    errorEl.textContent = "";
    heading.textContent = `Genre: ${genreParam}`;
    statusEl.textContent = "Loading…";

    const res = await fetchJson("/old-games");
    const all = (res.data || []).map(normalizeGame);
    const filtered = all.filter(g => gameHasGenre(g, genreParam));

    statusEl.textContent = `${filtered.length} game(s)`;
    render(filtered);
  } catch (err) {
    errorEl.textContent = err.message || "Failed to load games.";
    statusEl.textContent = "";
  }
}

init();
