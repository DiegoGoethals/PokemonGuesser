"use strict";

let _pokemon;
let _guesses_left;
init();

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

function showGuessesLeft() {
    document.querySelector("#guessesLeft").innerHTML = `${_guesses_left}`;
}

function checkPage(pokemon) {
    if (localStorage.getItem("gamemode") === "withImage") {
        showImage(pokemon);
        _guesses_left = 6;
    } else {
        _guesses_left = 10;
        document.getElementById("imageContainer").style.display = "none";
    }
    showGuessesLeft();
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
    let highScore;
    if (localStorage.getItem("gamemode") === "withImage") {
        highScore = "imageHighScore";
    } else {
        highScore = "noImageHighScore";
    }
    if (guess === _pokemon.name) {
        localStorage.setItem("currentScore", JSON.stringify(parseInt(localStorage.getItem("currentScore")) + 1));
        if (localStorage.getItem("currentScore") > localStorage.getItem(highScore)) {
            localStorage.setItem(highScore, localStorage.getItem("currentScore"));
        }
        openOverlay("Congrats, you won");
    } else if (_guesses_left > 1) {
        _guesses_left--;
    } else {
        localStorage.setItem("currentScore", JSON.stringify(0));
        openOverlay("You lost, you big loser");
    }
    showGuessesLeft();
}

function showGuess(guess) {
    fetchFromServer(`https://pokeapi.co/api/v2/pokemon/${guess}`, "GET").then(pokemon => {
        let tr = document.querySelector("table").insertRow();
        tr.innerHTML = `<tr>
                <td>${guess}</td>
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

function openOverlay(message) {
    let highScore;
    if (localStorage.getItem("gamemode") === "withImage") {
        highScore = JSON.parse(localStorage.getItem("imageHighScore"));
    } else {
        highScore = JSON.parse(localStorage.getItem("noImageHighScore"));
    }
    const overlay = document.getElementById("overlay");
    overlay.insertAdjacentHTML("beforeend", `
        <div id="endScreen">
            <p>${message}</p>
            <p>your current score is: ${JSON.parse(localStorage.getItem("currentScore"))}</p>
            <p>your highscore is: ${highScore}</p>
            <p>The pokémon we were looking for was:</p>
            <img src="${_pokemon.sprites.other["official-artwork"].front_default}" alt="${_pokemon.name}"/>
            <p>${_pokemon.name}</p>
            <button onclick="location.reload();">Play again</button>
        </div>
    `);
    overlay.style.display = "flex";
    document.querySelector("body").style.overflow = "hidden";
}

function off() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    document.querySelector("body").style.overflow = "auto";
    document.querySelector("body").style.marginRight = "0";
}