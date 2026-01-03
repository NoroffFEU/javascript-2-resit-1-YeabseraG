import { fetchJson } from "../lib/api.js";
import { getQueryParam } from "../lib/url.js";
import { isFavourited, toggleFavourite } from "../lib/favourites.js";

const titleEl = document.querySelector("#title");
const contentEl = document.querySelector("#content");
const errorEl = document.querySelector("#error");

const id = getQueryParam("id");

if (!id) {
  errorEl.textContent = "Missing game ID.";
  throw new Error("Missing game ID");
}

function normalizeGame(raw) {
  return {
    id: raw.id,
    name: raw.name ?? "Untitled",
    released: raw.released ?? null,
    description: raw.description ?? "No description available.",
    image: raw.image?.url ?? raw.image ?? "",
    genre: Array.isArray(raw.genre) ? raw.genre : (raw.genre ? [raw.genre] : []),
  };
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render(game) {
  titleEl.textContent = game.name;

  const fav = isFavourited(game.id);

  contentEl.innerHTML = `
    ${game.image ? `
      <img
        src="${game.image}"
        alt="${escapeHtml(game.name)}"
        style="width:100%;max-height:420px;object-fit:cover;border-radius:16px;border:1px solid var(--border);"
      />
    ` : ""}

    <div class="panel" style="margin-top:16px;">
      <div class="row">
        <strong>${escapeHtml(game.name)}</strong>
        <span class="small">${game.released ?? ""}</span>
      </div>

      <div class="badges" style="margin:10px 0;">
        ${game.genre.map(g => `
          <a class="badge" href="./genre.html?g=${encodeURIComponent(g)}">
            ${escapeHtml(g)}
          </a>
        `).join("")}
      </div>

      <p class="small">${escapeHtml(game.description)}</p>

      <button id="favBtn" class="${fav ? "primary" : ""}">
        ${fav ? "★ Favourited" : "☆ Favourite"}
      </button>
    </div>
  `;

  document.querySelector("#favBtn").addEventListener("click", () => {
    const nowFav = toggleFavourite(game.id);
    const btn = document.querySelector("#favBtn");
    btn.classList.toggle("primary", nowFav);
    btn.textContent = nowFav ? "★ Favourited" : "☆ Favourite";
  });
}

async function init() {
  try {
    const res = await fetchJson(`/old-games/${id}`);
    const game = normalizeGame(res.data);
    render(game);
  } catch (err) {
    errorEl.textContent = err.message || "Failed to load game.";
  }
}

init();
