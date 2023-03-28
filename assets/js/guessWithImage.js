"use strict";

function showImage(pokemon) {
    document.querySelector("#imageContainer").insertAdjacentHTML("beforeend", `
            <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="Sorry image not loading">`
    );
}