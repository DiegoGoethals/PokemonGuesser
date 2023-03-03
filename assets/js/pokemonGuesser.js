"use strict";

init();
let _pokemon;

function init() {
    setPokemon();
    document.querySelector("input").addEventListener("input", showOptions);
    document.querySelector("input").addEventListener("keypress", guess);
}

function setPokemon() {
    const pokemonId = Math.floor(Math.random() * 1008);
    fetchFromServer(JSON.parse(localStorage.getItem("allPokemon"))[pokemonId].url, "GET").then(pokemon => {
        checkPage(pokemon);
        _pokemon = pokemon;
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

function showOptions() {
    const list = document.querySelector("ul");
    list.innerHTML = "";
    list.style.display = "none";
    const input = document.querySelector("input");
    JSON.parse(localStorage.getItem("allPokemon")).filter(pokemon => {
        return pokemon.name.includes(input.value.toLowerCase());
    }).forEach(rightPokemon => {
        list.insertAdjacentHTML("beforeend", `
            <li>${rightPokemon.name}</li>
        `);
    });
    list.style.display = "block";
    if (input.value === "" || list.innerHTML === "") {
        list.style.display = "none";
    }
}

function guess(e) {
    const guess = document.querySelector("input").value.toLowerCase();
    if (e.key === "Enter") {
        if (guess === _pokemon.name) {
            alert("Congrats, you won");
            location.reload();
        } else {
            alert("You lost, you big loser");
            location.reload();
        }
    }
}