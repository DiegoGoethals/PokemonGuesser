"use strict";

init();
let _pokemon;
let _guesses_left = 6;

function init() {
    setPokemon();
    document.querySelector("input").addEventListener("input", showOptions);
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
    document.querySelectorAll("li").forEach(li => {
        li.addEventListener("click", autoComplete);
    });
    list.style.display = "block";
    if (input.value === "" || list.innerHTML === "") {
        list.style.display = "none";
    }
}

function autoComplete(e) {
    const list = document.querySelector("ul");
    const input = document.querySelector("input");
    input.value = e.target.innerHTML;
    input.innerHTML = e.target.innerHTML;
    list.style.display = "none";
    guess();
    input.value = "";
    input.innerHTML = "";
}

function guess() {
    const guess = document.querySelector("input").value.toLowerCase();
    showGuess(guess);
    if (guess === _pokemon.name) {
        alert("Congrats, you won");
        location.reload();
    } else if (_guesses_left > 1) {
        _guesses_left--;
    } else {
        alert("You lost, you big loser");
        location.reload();
    }
}

function showGuess(guess) {
    fetchFromServer(`https://pokeapi.co/api/v2/pokemon/${guess}`, "GET").then(pokemon => {
        document.querySelector("table").insertAdjacentHTML("beforeend", `
        <tr>
            <td>${guess.toUpperCase()}</td>
            <td>${pokemon.id}</td>
            ${getTypes(pokemon)}
            ${getAbilities(pokemon)}
        </tr>
    `);
    });
}

function getTypes(pokemon) {
    let types = "";
    console.log(_pokemon.types);
    console.log(pokemon.types);
    if (pokemon.types.length === 1) {
        if (_pokemon.types.includes(pokemon.types[0])) {
            types += `<td class="correct">${pokemon.types[0].type.name}</td><td>This pokemon only has 1 type</td>`
        } else {
            types += `<td>${pokemon.types[0].type.name}</td><td>This pokemon only has 1 type</td>`
        }
    } else {
        pokemon.types.forEach(type => {
            if (_pokemon.types.includes(type)) {
                types += `<td class="correct">${type.type.name}</td>`;
            } else {
                types += `<td>${type.type.name}</td>`;
            }
        });
    }
    return types;
}

function getAbilities(pokemon) {
    let abilities = "";
    pokemon.abilities.forEach(ability => {
        if (_pokemon.abilities.includes(ability)) {
            abilities += `<td class="correct">${ability.ability.name}</td>`;
        } else  {
            abilities += `<td>${ability.ability.name}</td>`;
        }
    });
    if (pokemon.abilities.length === 2) {
        abilities += `<td>This pokemon only has 2 abilities</td>`
    }
    return abilities;
}