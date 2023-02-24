"use strict";

init();

function init() {
    showImage();
}

function showImage() {
    fetchFromServer(_pokemon.url, "GET").then(pokemon => {
        document.querySelector("main").insertAdjacentHTML("afterbegin", `
            <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="Sorry image not loading">`
        );
    });
}