"use strict";

const MAX_SUGGESTIONS = 20;
const MODES = {
    image: { guesses: 6, highScoreKey: "imageHighScore" },
    noImage: { guesses: 10, highScoreKey: "noImageHighScore" },
};
const TYPE_COLORS = {
    normal: "#a8a77a", fire: "#ee8130", water: "#6390f0", electric: "#f7d02c", grass: "#7ac74c",
    ice: "#96d9d6", fighting: "#c22e28", poison: "#a33ea1", ground: "#e2bf65", flying: "#a98ff3",
    psychic: "#f95587", bug: "#a6b91a", rock: "#b6a136", ghost: "#735797", dragon: "#6f35fc",
    dark: "#705746", steel: "#b7b7ce", fairy: "#d685ad",
};
const POKEMON_BY_NAME = new Map(POKEDEX.map(pokemon => [pokemon.name, pokemon]));
// Searchable form of each name: "mr-mime" can be found by typing "mr mime"
const SEARCH_KEYS = POKEDEX.map(pokemon => [pokemon.name, pokemon.name.replaceAll("-", " ")]);

const modeName = MODES[localStorage.getItem("gamemode")] ? localStorage.getItem("gamemode") : "image";
const mode = MODES[modeName];

const els = {
    mystery: document.getElementById("mystery"),
    bar: document.getElementById("bar"),
    input: document.getElementById("guessInput"),
    suggestions: document.getElementById("suggestions"),
    balls: document.getElementById("balls"),
    result: document.getElementById("result"),
    hint: document.getElementById("hint"),
    guesses: document.getElementById("guesses"),
};

let _pokemon;
let _guessesLeft;
let _guessed;
let _over;
let _matches = [];
let _active = 0;

init();

function init() {
    els.input.addEventListener("input", showSuggestions);
    els.input.addEventListener("focus", showSuggestions);
    els.input.addEventListener("blur", hideSuggestions);
    els.input.addEventListener("keydown", onKeyDown);
    // mousedown instead of click so the input doesn't lose focus (and close the list) first
    els.suggestions.addEventListener("mousedown", e => {
        const li = e.target.closest("li");
        if (!li) return;
        e.preventDefault();
        guess(li.dataset.name);
    });
    newGame();
}

/* ---------- Helpers ---------- */

function artworkUrl(pokemon) {
    return `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
}

function prettyName(name) {
    return name.split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function readNumber(key) {
    return Number(localStorage.getItem(key)) || 0;
}

/* ---------- Round lifecycle ---------- */

function newGame() {
    _pokemon = POKEDEX[Math.floor(Math.random() * POKEDEX.length)];
    _guessesLeft = mode.guesses;
    _guessed = new Set();
    _over = false;

    els.mystery.classList.remove("revealed");
    if (modeName === "image") {
        els.mystery.innerHTML = `<img src="${artworkUrl(_pokemon)}" alt="Mystery Pokémon silhouette">`;
    } else {
        els.mystery.innerHTML = `<span class="question logo-text" aria-label="Mystery Pokémon">?</span>`;
        new Image().src = artworkUrl(_pokemon); // warm the cache for the reveal
    }

    els.guesses.innerHTML = "";
    els.hint.hidden = false;
    els.result.hidden = true;
    els.bar.hidden = false;
    els.input.value = "";
    renderBalls();
    els.input.focus();
}

function guess(name) {
    const guessed = POKEMON_BY_NAME.get(name);
    if (_over || !guessed || _guessed.has(name)) return;

    _guessed.add(name);
    els.input.value = "";
    hideSuggestions();
    addRow(guessed);

    if (guessed.id === _pokemon.id) {
        endGame(true);
        return;
    }
    _guessesLeft--;
    renderBalls();
    if (_guessesLeft === 0) {
        endGame(false);
    }
}

function endGame(won) {
    _over = true;
    const score = won ? readNumber("currentScore") + 1 : 0;
    localStorage.setItem("currentScore", JSON.stringify(score));
    if (score > readNumber(mode.highScoreKey)) {
        localStorage.setItem(mode.highScoreKey, JSON.stringify(score));
    }

    // The big reveal: show the real artwork in the burst
    els.mystery.innerHTML = `<img src="${artworkUrl(_pokemon)}" alt="${prettyName(_pokemon.name)}">`;
    els.mystery.classList.add("revealed");

    const used = mode.guesses - _guessesLeft + (won ? 1 : 0);
    els.result.innerHTML = `
        <h2 class="logo-text">It's ${prettyName(_pokemon.name)}!</h2>
        <p>${won ? `Congrats, you got it in ${used} ${used === 1 ? "guess" : "guesses"}!` : "You lost, you big loser!"}</p>
        <div class="chips">
            <span class="chip">Streak: ${score}</span>
            <span class="chip best">Best: ${readNumber(mode.highScoreKey)}</span>
        </div>
        <button id="playAgain">Play again</button>`;
    els.bar.hidden = true;
    els.result.hidden = false;
    const playAgain = document.getElementById("playAgain");
    playAgain.addEventListener("click", newGame);
    playAgain.focus();
}

function renderBalls() {
    const used = mode.guesses - _guessesLeft;
    els.balls.innerHTML = Array.from({ length: mode.guesses },
        (_, i) => `<span class="ball${i < used ? " used" : ""}"></span>`).join("");
    els.balls.setAttribute("aria-label", `${_guessesLeft} guesses left`);
}

/* ---------- Suggestions ---------- */

function showSuggestions() {
    const query = els.input.value.trim().toLowerCase().replaceAll("-", " ");
    if (query === "") {
        hideSuggestions();
        return;
    }
    // Names starting with the query first, then names that only contain it
    const startsWith = [];
    const contains = [];
    for (const [name, key] of SEARCH_KEYS) {
        if (_guessed.has(name)) continue;
        if (key.startsWith(query)) startsWith.push(name);
        else if (key.includes(query)) contains.push(name);
    }
    _matches = startsWith.concat(contains).slice(0, MAX_SUGGESTIONS);
    _active = 0;
    renderSuggestions();
}

function renderSuggestions() {
    els.suggestions.innerHTML = _matches.map((name, i) =>
        `<li role="option" data-name="${name}" class="${i === _active ? "active" : ""}">${prettyName(name)}</li>`
    ).join("");
    const open = _matches.length > 0;
    els.suggestions.classList.toggle("open", open);
    els.input.setAttribute("aria-expanded", String(open));
    els.suggestions.children[_active]?.scrollIntoView({ block: "nearest" });
}

function hideSuggestions() {
    _matches = [];
    els.suggestions.classList.remove("open");
    els.input.setAttribute("aria-expanded", "false");
}

function onKeyDown(e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!_matches.length) return;
        e.preventDefault();
        const step = e.key === "ArrowDown" ? 1 : -1;
        _active = (_active + step + _matches.length) % _matches.length;
        renderSuggestions();
    } else if (e.key === "Enter") {
        if (_matches.length) guess(_matches[_active]);
    } else if (e.key === "Escape") {
        hideSuggestions();
    }
}

/* ---------- Clue rows ---------- */

function addRow(pokemon) {
    els.hint.hidden = true;
    els.guesses.insertAdjacentHTML("afterbegin", `
        <div class="row">
            <span class="name">${prettyName(pokemon.name)}</span>
            ${dexTile(pokemon)}
            ${pokemon.types.map(typeTile).join("")}
            ${pokemon.abilities.map(abilityTile).join("")}
        </div>`);
}

function dexTile(pokemon) {
    if (pokemon.id === _pokemon.id) {
        return `<span class="tile match" title="Dex number">#${pokemon.id} ✓</span>`;
    }
    const higher = _pokemon.id > pokemon.id;
    return `<span class="tile" title="The mystery Pokémon's dex number is ${higher ? "higher" : "lower"}">#${pokemon.id} ${higher ? "↑" : "↓"}</span>`;
}

function typeTile(type) {
    const match = _pokemon.types.includes(type);
    return `<span class="tile type${match ? " match" : ""}" style="--type: ${TYPE_COLORS[type] ?? "#777"}" title="Type">${type}</span>`;
}

function abilityTile(ability) {
    const match = _pokemon.abilities.includes(ability);
    return `<span class="tile${match ? " match" : ""}" title="Ability">${ability.replaceAll("-", " ")}</span>`;
}
