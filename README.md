# OldGameArchive Platform (Front-End Client)

A front-end client for the **OldGameArchive** platform built with **plain HTML, CSS, and JavaScript (ES6 modules)**.  
The app consumes the Noroff **Old Games API** to display games and the Noroff **Auth API** to handle registration and login.

## Features (User Stories)
- **Register**: Create a new user account on the registration page.
- **Login**: Log in and store the session in `localStorage`.
- **View all games**: Browse all games on the home page.
- **Game details**: Open a game details page by clicking a game.
- **Favourites**: Favourite / unfavourite games (saved in `localStorage`).
- **Search**: Filter games by name using a search bar.
- **Sort**: Sort games by name or release date.
- **Genre pages**: View games by genre from genre links/badges.
- **Profile**: View the logged-in user profile and their favourites list.
- **Dynamic navbar**: Navigation updates based on login/auth state.

## Tech Stack
- **HTML5**
- **CSS3**
- **JavaScript (ES6 Modules)** (no frameworks)
- **Noroff Old Games API**
- **Noroff Auth API**

## APIs Used
- Old Games API: `https://docs.noroff.dev/docs/v2/basic/old-games`
- Noroff Auth API: `https://docs.noroff.dev/docs/v2/auth/register`

## Pages
- `index.html` — Home (list all games, search, sort, favourite)
- `game.html?id=<id>` — Game details
- `genre.html?g=<genre>` — Games filtered by genre
- `register.html` — Registration page
- `login.html` — Login page
- `profile.html` — User profile + favourites list

## How to Run the page Locally
This project uses **ES modules** (`import/export`).  
Because of this, you **cannot** run it correctly by double-clicking the HTML files (`file://...`).

You must serve it through a local web server.

### Option A: VS Code Live Server (Recommended)
1. Open the project folder in **VS Code**
2. Install the extension **Live Server**
3. Right-click `index.html` → **Open with Live Server**
4. Your browser should open something like:
   - `http://127.0.0.1:5500/index.html`

### Option B: Use a simple local server
If you have Node.js installed, you can run:
```bash
npx serve

