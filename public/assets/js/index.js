"use strict";

init();

function init() {
    initializeScores();
    document.querySelectorAll("main > div").forEach(div => {
        div.addEventListener("click", setGamemode);
    });
}

function setGamemode(e) {
    if (localStorage.getItem("gamemode") !== e.target.parentElement.id) {
        localStorage.setItem("currentScore", JSON.stringify(0));
    }
    localStorage.setItem("gamemode", e.target.parentElement.id);
}

function initializeScores() {
    if (localStorage.getItem("currentScore") === null) {
        localStorage.setItem("currentScore", JSON.stringify(0));
    }
    if (localStorage.getItem("imageHighScore") === null) {
        localStorage.setItem("imageHighScore", JSON.stringify(0));
    }
    if (localStorage.getItem("noImageHighScore") === null) {
        localStorage.setItem("noImageHighScore", JSON.stringify(0));
    }
}