"use strict";

init();

function init() {
    initializeHighscores();
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", setGamemode);
    });
}

function setGamemode(e) {
    if (localStorage.getItem("gamemode") !== e.target.id) {
        localStorage.setItem("currentScore", JSON.stringify(0));
    }
    localStorage.setItem("gamemode", e.target.id);
}

function initializeHighscores() {
    if (localStorage.getItem("currentScore") === null) {
        localStorage.setItem("currentScore", JSON.stringify(0));
    }
    if (localStorage.getItem("imageHighscore") === null) {
        localStorage.setItem("highscores", JSON.stringify(0));
    }
    if (localStorage.getItem("noImageHighscore") === null) {
        localStorage.setItem("highscores", JSON.stringify(0));
    }
}