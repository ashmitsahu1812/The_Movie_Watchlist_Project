const API_KEY = "thewdb";

let watchlist = [];

async function searchMovies() {
  const query = document.getElementById("movie-search-input").value.trim();
  if (!query) return;

  const resultsDiv = document.getElementById("movie-search-results");
  resultsDiv.textContent = "Loading...";

  const res = await fetch(`https://www.omdbapi.com/?s=${query}&type=movie&apikey=${API_KEY}`);
  const data = await res.json();

  resultsDiv.textContent = "";

  if (data.Response === "True") {
    const cards = data.Search.map(movie => createCard(movie));
    resultsDiv.append(...cards);
  } else {
    resultsDiv.textContent = "No movies found!";
  }
}

function createCard(movie) {
  const inList = watchlist.some(m => m.imdbID === movie.imdbID);

  let poster;
  if (movie.Poster !== "N/A") {
    poster = movie.Poster;
  } else {
    poster = "https://via.placeholder.com/70x100?text=No+Image";
  }

  const card = document.createElement("div");
  card.className = "movie-card";

  const img = document.createElement("img");
  img.src = poster;
  img.alt = movie.Title;

  const info = document.createElement("div");
  info.className = "movie-info";

  const title = document.createElement("h3");
  title.textContent = movie.Title;

  const year = document.createElement("p");
  year.textContent = movie.Year;

  const btn = document.createElement("button");
  if (inList) {
    btn.textContent = "✓ In Watchlist";
    btn.className = "remove-btn";
  } else {
    btn.textContent = "+ Add";
    btn.className = "add-btn";
  }
  btn.onclick = () => toggle(movie.imdbID, movie.Title, movie.Year, poster);

  info.append(title, year, btn);
  card.append(img, info);

  return card;
}

function toggle(id, title, year, poster) {
  const inList = watchlist.some(m => m.imdbID === id);

  if (inList) {
    watchlist = watchlist.filter(m => m.imdbID !== id);
  } else {
    watchlist.push({ imdbID: id, title, year, poster });
  }

  showWatchlist();
  searchMovies();
}

function showWatchlist() {
  const div = document.getElementById("watchlist-movies-container");
  div.textContent = "";

  if (watchlist.length === 0) {
    div.textContent = "Your watchlist is empty!";
    return;
  }

  watchlist.forEach(m => {
    const card = createCard({ imdbID: m.imdbID, Title: m.title, Year: m.year, Poster: m.poster });
    div.append(card);
  });
}

function pickRandom() {
  if (watchlist.length === 0) return alert("Add movies to your watchlist first!");

  const randomIndex = Math.floor(Math.random() * watchlist.length);
  const movie = watchlist.find((m, i) => i === randomIndex);

  document.getElementById("random-movie-poster").src = movie.poster;
  document.getElementById("random-movie-title").textContent = movie.title;
  document.getElementById("random-movie-year").textContent = "Year: " + movie.year;
  document.getElementById("random-movie-modal").classList.add("show");
}

function closeModal() {
  document.getElementById("random-movie-modal").classList.remove("show");
}

showWatchlist();
