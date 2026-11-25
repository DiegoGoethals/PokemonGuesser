"use strict";

init();

function init() {
    initializeScores();
    showHighScores();
    document.querySelectorAll(".mode").forEach(card => {
        card.addEventListener("click", setGamemode);
    });
    // Old versions cached the full Pokémon list here; it now ships in pokedex.js
    localStorage.removeItem("allPokemon");
}

function setGamemode(e) {
    // currentTarget is always the card, no matter which child was clicked
    const mode = e.currentTarget.dataset.mode;
    if (localStorage.getItem("gamemode") !== mode) {
        localStorage.setItem("currentScore", JSON.stringify(0));
    }
    localStorage.setItem("gamemode", mode);
}

function showHighScores() {
    document.getElementById("imageHighScore").textContent = localStorage.getItem("imageHighScore");
    document.getElementById("noImageHighScore").textContent = localStorage.getItem("noImageHighScore");
}

function initializeScores() {
    for (const key of ["currentScore", "imageHighScore", "noImageHighScore"]) {
        if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, JSON.stringify(0));
        }
    }
}
