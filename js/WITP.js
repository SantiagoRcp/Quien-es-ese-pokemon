// Variables y elementos del DOM
const $divAlphabet = document.getElementById("alphabet");
const $divHiddenWord = document.getElementById("hiddenWord");
const $imgPokemon = document.getElementById("imgPokemon");
const $btnNext = document.getElementById("btnNext");
const $pHiddenWord = document.createElement("p");
const $spanScore = document.querySelector(".score #points");
const $spanPokemonsFound = document.querySelector(".score #found");
const $spanError = document.querySelector(".score #error");
let score = 0;
let error = 0;
let pokemonsFound = 0;
let arrayWord = [];
let hiddenWord = [];
const pokemonData = {};
let IdApi;
const alphabetLetter = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  // "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

storage(pokemonsFound, score, IdApi);

let numlsScore = parseInt(localStorage.getItem("lsScore"));
let numlspokemonsFound = parseInt(localStorage.getItem("lspokemonsFound"));
let numlsApi = parseInt(localStorage.getItem("lsApi"));

//lectura de localStorage
numlsScore > 0
  ? ($spanScore.textContent = localStorage.getItem("lsScore"))
  : ($spanScore.textContent = score);

numlspokemonsFound > 0
  ? ($spanPokemonsFound.textContent = localStorage.getItem("lspokemonsFound"))
  : ($spanPokemonsFound.textContent = pokemonsFound);

numlsApi > 1 ? (IdApi = numlsApi) : (IdApi = 1);

$spanError.textContent = error;

// API de pokemon PokeApi
async function fetchPokemon(IdApi) {
  const fetchDAta = await fetch(`https://pokeapi.co/api/v2/pokemon/${IdApi}/`);
  const data = await fetchDAta.json();
  pokemonData.name = data.name;
  pokemonData.img = data.sprites.other.home.front_default;

  return pokemonData;
}

// Mostrando el alfabeto
export function btnletters() {
  alphabetLetter.forEach((letter) => {
    const btnLetter = document.createElement("button");
    btnLetter.classList.add("btn");
    btnLetter.classList.add("btn_enabled");
    btnLetter.disabled = false;

    btnLetter.textContent = letter;
    $divAlphabet.appendChild(btnLetter);
  });
}

// Mostrando la img y el nombre oculto del pokemon
export async function hiddenWordDisplay() {
  const { name, img } = await fetchPokemon(IdApi);
  $imgPokemon.src = img;
  $imgPokemon.classList.add("img_pokemon-hidden");
  $imgPokemon.classList.remove("img_pokemon-visible");
  $btnNext.disabled = true;
  arrayWord = name.split("");

  for (let i = 0; i <= arrayWord.length - 1; i++) {
    if (arrayWord[i] == " ") {
      hiddenWord[i] = " ";
      continue;
    }
    hiddenWord[i] = "_";
  }

  // Llamando a la funcion de localStorage
  storage(pokemonsFound, score, IdApi);

  $pHiddenWord.textContent = hiddenWord.toString().replace(/,/g, "");
  $divHiddenWord.appendChild($pHiddenWord);
}

// Evento Click dem= los btn del alfabeto
export function btnClick() {
  const $btnLetter = document.querySelectorAll(".btn_enabled");
  $btnLetter.forEach((letter) => {
    letter.addEventListener("click", (e) => {
      let letter = e.target.textContent.toLowerCase();
      ValidateLetter(letter);
    });
  });
}

// Validando que la letra sea valida
function ValidateLetter(letter) {
  let encontrada;
  for (let i = 0; i <= arrayWord.length - 1; i++) {
    if (letter == arrayWord[i]) {
      encontrada = true;
      hiddenWord[i] = letter;
      numlsScore += 2;
    }
  }

  if (!encontrada) error++;

  $pHiddenWord.textContent = hiddenWord.toString().replace(/,/g, "");
  $divHiddenWord.appendChild($pHiddenWord);
  $spanScore.textContent = numlsScore;
  $spanError.textContent = error;

  disableLetterButton(letter);
  errorLetter();
  ValidateWord();
}

// Validando si adivino el pokemon
function ValidateWord() {
  let isEqual = arrayWord.toString() == hiddenWord.toString();
  if (isEqual) {
    numlsScore += 5;
    numlspokemonsFound++;

    score = numlsScore;
    IdApi++;
    pokemonsFound = numlspokemonsFound;

    disableLetterButton();

    setTimeout(() => {
      Swal.fire("Felicidades Adivinaste el pokemon!");

      $imgPokemon.classList.remove("img_pokemon-hidden");
      $imgPokemon.classList.add("img_pokemon-visible");
      $btnNext.disabled = false;

      $btnNext.addEventListener("click", newGame);
    }, 250);

    $spanScore.textContent = score;
    $spanPokemonsFound.textContent = pokemonsFound;
  }
}

// Verificamos el numero de errores
function errorLetter() {
  if (error >= 5) {
    const { name } = pokemonData;
    Swal.fire("No Adivinaste al Ppokemon!");

    $imgPokemon.classList.remove("img_pokemon-hidden");
    $imgPokemon.classList.add("img_pokemon-visible");
    $pHiddenWord.textContent = name;

    disableLetterButton();

    IdApi++;
    $btnNext.disabled = false;
    $btnNext.addEventListener("click", newGame);
  }
}

// Iniciamos una Nueva Partida
function newGame() {
  error = 0;
  hiddenWord = [];
  hiddenWordDisplay();
  enableLetterButton();

  localStorage.setItem("lsScore", score);
  localStorage.setItem("lspokemonsFound", pokemonsFound);
  localStorage.setItem("lsApi", IdApi);
  $spanError.textContent = error;
}

// Desavilitamos los btn del alfabeto
function disableLetterButton(letter = null) {
  const $btnLetter = document.querySelectorAll(".alphabet .btn_enabled");
  if (letter != null) {
    $btnLetter.forEach((btnLetter) => {
      if (btnLetter.textContent.toLowerCase() == letter) {
        btnLetter.disabled = true;
        btnLetter.classList.remove("btn_enabled");
        btnLetter.classList.add("btn_disabled");
      }
    });
  } else {
    $btnLetter.forEach((btnLetter) => {
      btnLetter.disabled = true;
      btnLetter.classList.remove("btn_enabled");
      btnLetter.classList.add("btn_disabled");
    });
  }
}

// Avilitamos los btn del Alfabeto
function enableLetterButton() {
  const $btnLetter = document.querySelectorAll(".alphabet .btn_disabled");
  $btnLetter.forEach((btnLetter) => {
    btnLetter.disabled = false;
    btnLetter.classList.add("btn_enabled");
    btnLetter.classList.remove("btn_disabled");
  });
}

//Asignamos Las Variables de localStorage
function storage(pkmFound, points, idApi) {
  if (localStorage.getItem("lsScore") === null)
    localStorage.setItem("lsScore", points);

  if (localStorage.getItem("lspokemonsFound") === null)
    localStorage.setItem("lspokemonsFound", pkmFound);

  if (localStorage.getItem("lsApi") === null) localStorage.setItem("lsApi", 1);
}

// localStorage.removeItem("colorTheme");
// removestorage();
// function removestorage() {
//   localStorage.removeItem("lsScore");
//   localStorage.removeItem("lsApi");
//   localStorage.removeItem("lspokemonsFound");
// }
