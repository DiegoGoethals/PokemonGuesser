"use strict";

init();

function init() {
    getPokemonFromApi();
}

function getPokemonFromApi() {
    const pokemons = [];
    fetchFromServer(`${_config.apiURL}pokemon?limit=1008&offset=0`, "GET").then(result => {
        localStorage.setItem("allPokemon", JSON.stringify(result.results));
    });
}