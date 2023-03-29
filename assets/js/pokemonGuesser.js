"use strict";

let _pokemon;
let _guesses_left = 6;
init();

function init() {
    showGuessesLeft();
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

function showGuessesLeft() {
    document.querySelector("#guessesLeft").innerHTML = `${_guesses_left}`;
}

function checkPage(pokemon) {
    if (localStorage.getItem("gamemode") === "withImage") {
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
    showGuessesLeft();
}

function showGuess(guess) {
    fetchFromServer(`https://pokeapi.co/api/v2/pokemon/${guess}`, "GET").then(pokemon => {
        let tr = document.querySelector("table").insertRow();
        tr.innerHTML = `<tr>
                <td>${guess.toUpperCase()}</td>
                ${checkId(pokemon)}
                ${getTypes(pokemon)}
                ${getAbilities(pokemon)}
            </tr>`;
    });
}

function checkId(pokemon) {
    if (pokemon.id > _pokemon.id) {
        return `<td>${pokemon.id} <i class="fa-solid fa-arrow-down"></i></td>`
    } else {
        return `<td>${pokemon.id} <i class="fa-solid fa-arrow-up"></i></td>`
    }
}

function getTypes(pokemon) {
    let types = "";
    if (pokemon.types.length === 1) {
        if (isCorrectType(pokemon.types[0])) {
            types += `<td class="correct">${pokemon.types[0].type.name}</td>`
        } else {
            types += `<td>${pokemon.types[0].type.name}</td>`
        }
        types += `<td>/</td>`;
    } else {
        pokemon.types.forEach(type => {
            if (isCorrectType(type)) {
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
        if (isCorrectAbility(ability)) {
            abilities += `<td class="correct">${ability.ability.name.replace("-", " ")}</td>`;
        } else  {
            abilities += `<td>${ability.ability.name.replace("-", " ")}</td>`;
        }
    });
    if (pokemon.abilities.length < 3) {
        for (let i = pokemon.abilities.length; i < 3; i++) {
            abilities += `<td>/</td>`;
        }
    }
    return abilities;
}

function isCorrectType(type) {
    const types = _pokemon.types.map(type => {
        return type.type.name;
    });
    return types.includes(type.type.name);
}

function isCorrectAbility(ability) {
    const abilities = _pokemon.abilities.map(ability => {
        return ability.ability.name;
    });
    return abilities.includes(ability.ability.name);
}