"use strict";

function showImage(pokemon) {
    document.querySelector("main").insertAdjacentHTML("beforeend", `
        <div id="imageContainer">
            <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="Sorry image not loading">
        </div>`
    );
}