"use strict";

init();

function init() {
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", setGamemode);
    });
}

function setGamemode(e) {
    localStorage.setItem("gamemode", e.target.id);
}