"use strict";

init();

function init() {
    setPokemon();
}

function setPokemon() {
    const pokemonId = Math.floor(Math.random() * 1008);
    fetchFromServer(JSON.parse(localStorage.getItem("allPokemon"))[pokemonId].url, "GET").then(pokemon => {
        checkPage(pokemon);
    });
}

function checkPage(pokemon) {
    const title = document.querySelector("title").innerHTML;
    if (title.includes("image")) {
        showImage(pokemon);
    } else {
        // TO DO
    }
}

function guess() {

}