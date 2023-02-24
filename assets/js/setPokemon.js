"use strict";

let _pokemon;
init();

function init() {
    setPokemon();
}

function setPokemon() {
    const pokemonId = Math.floor(Math.random() * 1008);
    _pokemon = JSON.parse(localStorage.getItem("allPokemon"))[pokemonId];
}

function guess() {

}