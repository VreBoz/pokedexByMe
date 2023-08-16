/**
 * Array containing various Pokémon types.
 * @type {string[]}
 */
const pokmnTypesBg = [
  "grass",
  "fire",
  "water",
  "electric",
  "bug",
  "normal",
  "flying",
  "poison",
  "ground",
  "rock",
  "fighting",
  "psychic",
  "ghost",
  "ice",
  "dragon",
  "fairy",
  "steel",
  "dark",
  "electric/flying",
  "water/flying",
];

/**
 * Object containing colors associated with Pokémon types.
 * @type {Object.<string, string>}
 */
let typeColors = {
  grass: "rgba(123, 206, 82, 0.8)", // Grün
  fire: "rgba(247, 82, 49, 0.8)", // Rot
  water: "rgba(57, 156, 255, 0.8)", // Blau
  electric: "rgba(255, 198, 49, 0.8)", // Gelb
  bug: "rgba(173, 189, 33, 0.8)", // Dunkelgelb
  normal: "rgba(173, 165, 148, 0.8)", // Grau
  flying: "rgba(156, 173, 247, 0.8)", // Schwarz
  poison: "rgba(181, 90, 165, 0.8)", // Violett
  ground: "rgba(214, 181, 90, 0.8)", // Braun
  rock: "rgba(189, 165, 90, 0.8)", // Braun
  fighting: "rgba(165, 82, 57, 0.8)", // Dunkelrot
  psychic: "rgba(255, 115, 165, 0.8)", // Pink
  ghost: "rgba(99, 99, 181, 0.8)", // Violett
  ice: "rgba(90, 206, 231, 0.8)", // Hellblau
  dragon: "rgba(123, 99, 231, 0.8)", // Indigo
  fairy: "rgba(230, 165, 230, 0.8)", // Rosa
  steel: "rgba(173, 173, 198, 0.8)", // Silber
  dark: "rgba(115, 90, 74, 0.8)", // Schwarz
};

/**
 * Object containing bigger, non-transparent colors associated with Pokémon types.
 * @type {Object.<string, string>}
 */
let typeColorsBig = {
  grass: "rgb(123, 206, 82)", // Grün
  fire: "rgb(247, 82, 49)", // Rot
  water: "rgb(57, 156, 255)", // Blau
  electric: "rgb(255, 198, 49)", // Gelb
  bug: "rgb(173, 189, 33)", // Dunkelgelb
  normal: "rgb(173, 165, 148)", // Grau
  flying: "rgb(156, 173, 247)", // Schwarz
  poison: "rgb(181, 90, 165)", // Violett
  ground: "rgb(214, 181, 90)", // Braun
  rock: "rgb(189, 165, 90)", // Braun
  fighting: "rgb(165, 82, 57)", // Dunkelrot
  psychic: "rgb(255, 115, 165)", // Pink
  ghost: "rgb(99, 99, 181)", // Violett
  ice: "rgb(90, 206, 231)", // Hellblau
  dragon: "rgb(123, 99, 231)", // Indigo
  fairy: "rgb(230, 165, 230)", // Rosa
  steel: "rgb(173, 173, 198)", // Silber
  dark: "rgb(115, 90, 74)", // Schwarz
};
let renderedPokemonCount = 0;
/**
 * An array to store data for all Pokémon.
 * @type {Object[]}
 */
let allPokemon = []; // Ein Array zur Speicherung aller Pokemon-Daten
/**
 * The maximum number of Pokémon to load at once.
 * @type {number}
 */
let limited = 40;

/**
 * The offset for loading Pokémon data.
 * @type {number}
 */
let offseted = 0;

/**
 * Counter for the number of loaded Pokémon.
 * @type {number}
 */
let loadedPokemonCount = 0;

/**
 * The number of Pokémon to load in each increment.
 * @type {number}
 */
const loadIncrement = 40;

/**
 * The index of the currently displayed Pokémon.
 * @type {number}
 */
let currentPokemonIndex = 0;

/**
 * Flag indicating whether Pokémon data is currently being loaded.
 * @type {boolean}
 */
let loading = false;

/**
 * Asynchronously loads Pokémon data from the PokeAPI and performs various rendering and processing tasks.
 *
 * @param {number} [offset=0] - The offset value for pagination of Pokémon data.
 * @returns {Promise<void>} A Promise that resolves once the Pokémon data is loaded and processed.
 */
async function loadPokemon(offset = 0) {
  showLoadingScreen();
  loading = true;
  let url = `https://pokeapi.co/api/v2/pokemon?limit=${loadIncrement}&offset=${offset}`;
  let response = await fetch(url);
  let pokemonList = await response.json();

  let allPokemonURLs = [];
  for (let i = 0; i < pokemonList["results"].length; i++) {
    allPokemonURLs.push(pokemonList["results"][i]["url"]);
  }

  for (let i = 0; i < allPokemonURLs.length; i++) {
    let pokemon = await fetchIndividualPokemonData(allPokemonURLs[i]);
    allPokemon.push(pokemon);
  }

  document
    .getElementById("pokemonSearch")
    .addEventListener("input", function () {
      searchPokemon(this.value);
    });
  renderPokemon();
  setPokemonBackgroundColors();
  loadedPokemonCount += loadIncrement;
  loading = false;
  hideLoadingScreen();
}

/**
 * Loads more Pokémon data if loading is not already in progress.
 * Calls the 'loadPokemon' function with an offset to load additional Pokémon.
 */
function loadMorePokemon() {
  if (!loading) {
    loadPokemon(loadedPokemonCount);
  }
}

/**
 * Displays the loading screen by setting its display style to 'flex'.
 */
function showLoadingScreen() {
  document.getElementById("loadingScreen").style.display = "flex";
}

/**
 * Hides the loading screen by setting its display style to 'none'.
 */
function hideLoadingScreen() {
  document.getElementById("loadingScreen").style.display = "none";
}

/**
 * Fetches data from the specified URL using the 'fetch' API.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<object>} A Promise that resolves with the fetched JSON data.
 */
async function fetchData(url) {
  let response = await fetch(url); // Anfrage an die angegebene URL senden und Antwort speichern
  let data = await response.json(); // Antwort von einem Response-Objekt in ein JSON-Objekt umwandeln
  return data; // JSON-Objekt zurückgeben
}

/**
 * Generates an array of Pokémon types from the JSON data.
 *
 * @param {object} data - The JSON data containing Pokémon information.
 * @returns {string[]} An array of Pokémon types.
 */
function generateTypes(data) {
  let types = []; // Leeres Array für die Typen erstellen
  for (let i = 0; i < data["types"].length; i++) {
    types.push(data["types"][i].type.name);
  }
  return types;
}

/**
 * Generates an object containing the base stats of a Pokémon from the JSON data.
 *
 * @param {object} data - The JSON data containing Pokémon information.
 * @returns {object} An object representing the base stats of the Pokémon.
 */
function generateBaseStats(data) {
  let stats = data["stats"]; // Stats aus den Daten speichern
  let baseStats = {}; // Leeres Objekt für die Basis-Stats erstellen
  for (let j = 0; j < stats.length; j++) {
    // Für jeden Stat in 'stats'...
    let statName = stats[j].stat.name; // ... den Stat-Namen speichern
    let baseStat = stats[j].base_stat; // ... den Basis-Stat speichern
    baseStats[statName] = baseStat; // Den Stat-Namen und den Basis-Stat zum 'baseStats'-Objekt hinzufügen
  }
  return baseStats; // 'baseStats'-Objekt zurückgeben
}

/**
 * Fetches individual Pokémon data from the specified URL.
 *
 * @param {string} url - The URL to fetch Pokémon data from.
 * @returns {Promise<object>} A Promise that resolves with the fetched Pokémon data.
 */
async function fetchIndividualPokemonData(url) {
  let data = await fetchData(url); // Daten von der angegebenen URL abrufen
  let id = String(data["id"]).padStart(3, "0"); // ID des Pokémon formatieren und als String speichern
  let name = data["name"]; // Name des Pokémon speichern
  let image = data["sprites"]["other"]["dream_world"]["front_default"]; // Bild des Pokémon speichern
  let types = generateTypes(data); // Typen des Pokémon generieren
  let baseStats = generateBaseStats(data); // Basis-Stats des Pokémon generieren
  return { id, name, image, types, baseStats }; // Gesammelte Daten zurückgeben
}

/**
 * Renders Pokémon data that hasn't been displayed yet.
 *
 * Updates the 'renderedPokemonCount' and appends the generated HTML for each new Pokémon to the specified container.
 */
function renderPokemon() {
  const container = document.getElementById("pokemonName");

  for (let i = renderedPokemonCount; i < allPokemon.length; i++) {
    let pokemon = allPokemon[i];
    let pokemonHtml = generatePokemonHtml(pokemon, i);
    container.innerHTML += pokemonHtml;
  }

  renderedPokemonCount = allPokemon.length;
}

/**
 * Searches for Pokémon based on the given query and updates the displayed list.
 * If the query is empty, reloads the page to reset the search.
 *
 * @param {string} query - The search query for Pokémon names.
 */
function searchPokemon(query) {
  if (query.trim() === "") {
    // seite neu laden
    window.location.reload();
    return;
  }
  // Den aktuellen Inhalt der Pokémon-Liste löschen
  const pokemonListElement = document.getElementById("pokemonName"); // Ersetzen Sie "yourPokemonListElementId" durch die tatsächliche ID des Elements, das die Pokémon-Liste enthält
  pokemonListElement.innerHTML = "";

  // Durchlaufen Sie das Array "allPokemon" und suchen Sie nach dem Namen
  for (let i = 0; i < allPokemon.length; i++) {
    if (allPokemon[i].name.toLowerCase().includes(query.toLowerCase())) {
      // Wenn ein Pokémon gefunden wird, das dem Suchbegriff entspricht, fügen Sie es zur Liste hinzu.
      const pokemonElement = document.createElement("div"); // Oder ein anderes geeignetes Element
      pokemonElement.innerHTML = createPokemonListItem(allPokemon[i]); // Diese Funktion sollten Sie basierend auf Ihrer Anwendung implementieren
      pokemonListElement.appendChild(pokemonElement);

      // Event listener hinzufügen, damit Sie auf ein Pokémon klicken und es in der "Big Card" anzeigen können
      pokemonElement.addEventListener("click", function () {
        renderBigCard(i);
      });
    }
  }
  setPokemonBackgroundColors();
}

/**
 * Generates HTML markup for displaying a Pokémon's information in a list item format.
 *
 * @param {object} pokemon - The Pokémon object containing information like name, image, types, and ID.
 * @returns {string} HTML markup representing the Pokémon list item.
 */
function createPokemonListItem(pokemon) {
  let capitalized = capitalizeName(pokemon.name);
  let typesHtml = generateTypesHtml(pokemon.types);

  return `
          <div id="b-g-swich" class="pkmn-name-img" >
          <h3>${capitalized}</h3>
          <img id="pokemon-icons"  src="${pokemon.image}" alt="${capitalized}">
          <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12ZM5.07089 13C5.55612 16.3923 8.47353 19 12 19C15.5265 19 18.4439 16.3923 18.9291 13H14.8293C14.4174 14.1652 13.3062 15 12 15C10.6938 15 9.58251 14.1652 9.17068 13H5.07089ZM18.9291 11C18.4439 7.60771 15.5265 5 12 5C8.47353 5 5.55612 7.60771 5.07089 11H9.17068C9.58251 9.83481 10.6938 9 12 9C13.3062 9 14.4174 9.83481 14.8293 11H18.9291ZM12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor" />
          </svg>
          <div class="type-div">${typesHtml}</div>
          <div>
        <p class="id-nr">#${pokemon.id}</p>
          </div>
        </div>`;
}

/**
 * Generates HTML markup for displaying a Pokémon's information in a compact format.
 *
 * @param {object} pokemon - The Pokémon object containing information like name, image, types, and ID.
 * @param {number} i - The index of the Pokémon in the 'allPokemon' array.
 * @returns {string} HTML markup representing the Pokémon compact display.
 */
function generatePokemonHtml(pokemon, i) {
  let capitalized = capitalizeName(pokemon.name);
  let typesHtml = generateTypesHtml(pokemon.types);

  let html = `
    <div id="b-g-swich" class="pkmn-name-img" onclick="currentPokemonIndex = ${i}; renderBigCard(${i})">
      <h3>${capitalized}</h3>
      <img  id="pokemon-icons" src="${pokemon.image}" alt="${capitalized}">
      <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12ZM5.07089 13C5.55612 16.3923 8.47353 19 12 19C15.5265 19 18.4439 16.3923 18.9291 13H14.8293C14.4174 14.1652 13.3062 15 12 15C10.6938 15 9.58251 14.1652 9.17068 13H5.07089ZM18.9291 11C18.4439 7.60771 15.5265 5 12 5C8.47353 5 5.55612 7.60771 5.07089 11H9.17068C9.58251 9.83481 10.6938 9 12 9C13.3062 9 14.4174 9.83481 14.8293 11H18.9291ZM12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor" />
      </svg>
      <div class="type-div">${typesHtml}</div>
      <div>
        <p class="id-nr">#${pokemon.id}</p>
      </div>
    </div>`;
  return html;
}

/**
 * Generates HTML markup for displaying Pokémon types.
 *
 * @param {string[]} types - An array of Pokémon types.
 * @returns {string} HTML markup representing the types.
 */
function generateTypesHtml(types) {
  let typesHtml = "";
  for (let j = 0; j < types.length; j++) {
    let type = types[j];
    typesHtml += `<span class="type type-${type.toLowerCase()}">${type}</span>`;
  }
  return typesHtml;
}

/**
 * Capitalizes the first letter of the provided name.
 *
 * @param {string} name - The name to capitalize.
 * @returns {string} The capitalized name.
 */
function capitalizeName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Renders the big card for a Pokémon with detailed information.
 *
 * @param {number} index - The index of the Pokémon in the 'allPokemon' array.
 */
function renderBigCard(index) {
  const bigCardContainer = document.getElementById("big-card"); // Das Container-Element für die große Karte wird aus dem DOM abgerufen
  let pokemon = allPokemon[index]; // Das Pokemon-Objekt mit dem angegebenen Index wird aus dem Array 'allPokemon' abgerufen
  let capitalized =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // Der Name des Pokemons wird großgeschrieben

  const infoCard = document.getElementById("info-card"); // Das Element für die Info-Karte wird aus dem DOM abgerufen
  infoCard.innerHTML = ""; // Der Inhalt der Info-Karte wird geleert

  const bigCardHtml = createBigCardHtml(pokemon, capitalized); // Die HTML-Darstellung der großen Karte wird erstellt
  bigCardContainer.innerHTML = bigCardHtml; // Die große Karte wird in den Container eingefügt

  const infoCardHtml = createInfoCardHtml(); // Die HTML-Darstellung der Info-Karte wird erstellt
  infoCard.innerHTML = infoCardHtml; // Die Info-Karte wird mit dem HTML-Inhalt gefüllt

  let baseStats = generateStatsForChart(pokemon);
  document.getElementById("pkmn-bg").classList.remove("d-none"); // Die Klasse 'd-none' wird vom Hintergrund-Element entfernt, um es anzuzeigen

  initBgAndChart(baseStats);
  manageButtonVisibility(index);
}

/**
 * Initializes the background, chart, and button colors for the big card display.
 *
 * @param {object} baseStats - The base stats of the Pokémon.
 */
function initBgAndChart(baseStats) {
  addChart(baseStats); // Das Diagramm mit den Basis-Stats des Pokemons wird erstellt und eingefügt
  setBigCardBackgroundColor(); // Die Hintergrundfarbe der großen Karte wird festgelegt
  setButtonBackgroundColors(); // Die Hintergrundfarben der Buttons werden festgelegt
}

/**
 * Generates stats data for creating a chart.
 *
 * @param {object} pokemon - The Pokémon object containing information like baseStats.
 * @returns {object} The stats data for the chart.
 */
function generateStatsForChart(pokemon) {
  return {
    Attack: pokemon.baseStats.attack, // Der Angriffs-Stat des Pokemons wird abgerufen
    Defense: pokemon.baseStats.defense, // Der Verteidigungs-Stat des Pokemons wird abgerufen
    HP: pokemon.baseStats.hp, // Der KP-Stat (KP = Kraftpunkte) des Pokemons wird abgerufen
    "Special Attack": pokemon.baseStats["special-attack"], // Der Spezial-Angriffs-Stat des Pokemons wird abgerufen
    "Special Defense": pokemon.baseStats["special-defense"], // Der Spezial-Verteidigungs-Stat des Pokemons wird abgerufen
    Speed: pokemon.baseStats.speed, // Der Geschwindigkeits-Stat des Pokemons wird abgerufen
  };
}

/**
 * Creates HTML markup for displaying detailed information of a Pokémon in the big card.
 *
 * @param {object} pokemon - The Pokémon object containing detailed information.
 * @param {string} capitalized - The capitalized name of the Pokémon.
 * @returns {string} HTML markup representing the big card display.
 */
function createBigCardHtml(pokemon, capitalized) {
  let typesHtml = "";
  for (let i = 0; i < pokemon.types.length; i++) {
    let type = pokemon.types[i];
    typesHtml += `<span class="type type-${type.toLowerCase()}">${type}</span>`;
  }

  return `
    <div id="testOne" class="bgTwo">
      <button onclick="left()" class="left-btn"><img src="./img/left.png" alt=""></button>
      <button onclick="right()" id="right-btn" class="right-btn"><img src="./img/right.png" alt=""></button>
      <div class="like-close">
        <img  onclick="hidePkmnBg()" class="icon-width cursor-pointer" src="./img/icons8-schließen-67.png" alt="">
        
      </div>
      <svg class="big-SVG" width="300px" height="300px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12ZM5.07089 13C5.55612 16.3923 8.47353 19 12 19C15.5265 19 18.4439 16.3923 18.9291 13H14.8293C14.4174 14.1652 13.3062 15 12 15C10.6938 15 9.58251 14.1652 9.17068 13H5.07089ZM18.9291 11C18.4439 7.60771 15.5265 5 12 5C8.47353 5 5.55612 7.60771 5.07089 11H9.17068C9.58251 9.83481 10.6938 9 12 9C13.3062 9 14.4174 9.83481 14.8293 11H18.9291ZM12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor" />
      </svg>
      <img class="img-absolute" src="${pokemon.image}" alt="${capitalized}">
      <div class="info-div">
        <div>
          <h3>${capitalized}</h3>
          <div class="types">${typesHtml}</div>
        </div>
        <p class="id-nr">#${pokemon.id}</p>
      </div>
    </div>`;
}

/**
 * Creates HTML markup for displaying the chart in the info card.
 *
 * @returns {string} HTML markup for the chart.
 */
function createInfoCardHtml() {
  return `
    <canvas id="myChart"></canvas>
  `;
}

/**
 * Sets the background colors of the Pokémon elements based on their types.
 */
function setPokemonBackgroundColors() {
  const pokemonElements = document.querySelectorAll(".pkmn-name-img"); // Alle Elemente mit der Klasse "pkmn-name-img" aus dem DOM abrufen

  for (let i = 0; i < pokemonElements.length; i++) {
    const pokemonElement = pokemonElements[i]; // Das aktuelle Pokemon-Element

    // Den Namen des Pokemon aus dem Element holen und es verwenden, um die Daten aus dem allPokemon Array zu erhalten.
    let pokemonName = pokemonElement
      .querySelector("h3")
      .textContent.toLowerCase();
    const pokemon = allPokemon.find((pkmn) => pkmn.name === pokemonName);
    const types = pokemon.types;

    let bgColor = "";
    if (types.length === 1) {
      // Wenn das Pokemon nur einen Typ hat
      const type = types[0];
      bgColor = typeColors[type]; // Die Hintergrundfarbe für den Typ aus dem 'typeColors'-Objekt abrufen
    } else if (types.length === 2) {
      // Wenn das Pokemon zwei Typen hat
      const type1 = types[0];
      const type2 = types[1];
      bgColor = `linear-gradient(to right, ${typeColors[type1]}, ${typeColors[type2]})`; // Einen Farbverlauf zwischen den beiden Typen erstellen
    }

    pokemonElement.style.background = bgColor; // Die Hintergrundfarbe des Pokemon-Elements setzen
  }
}

/**
 * Sets the background color of the big card based on the Pokémon's types.
 */
function setBigCardBackgroundColor() {
  const bigCardElement = document.getElementById("big-card"); // Das Element für die große Karte aus dem DOM abrufen
  const types = allPokemon[currentPokemonIndex].types; // Die Typen des aktuellen Pokemons aus dem Array 'allPokemon' abrufen

  let bgColor = "";
  if (types.length === 1) {
    // Wenn das Pokemon nur einen Typ hat
    const type = types[0];
    bgColor = typeColorsBig[type]; // Die Hintergrundfarbe für den Typ aus dem 'typeColorsBig'-Objekt abrufen
  } else if (types.length === 2) {
    // Wenn das Pokemon zwei Typen hat
    const type1 = types[0];
    const type2 = types[1];
    bgColor = `linear-gradient(to right, ${typeColorsBig[type1]}, ${typeColorsBig[type2]})`; // Einen Farbverlauf zwischen den beiden Typen erstellen
  }

  bigCardElement.style.background = bgColor; // Die Hintergrundfarbe der großen Pokemon-Karte setzen
}

/**
 * Sets the background colors of the "right" and "left" buttons on the big card.
 */
function setButtonBackgroundColors() {
  const buttonElements = document.querySelectorAll(".right-btn, .left-btn"); // Alle Elemente mit den Klassen "right-btn" und "left-btn" aus dem DOM abrufen

  for (let i = 0; i < buttonElements.length; i++) {
    const buttonElement = buttonElements[i]; // Das aktuelle Button-Element
    const pokemon = allPokemon[currentPokemonIndex]; // Das aktuelle Pokemon

    let bgColor = "";
    if (pokemon.types.length === 1) {
      // Wenn das Pokemon nur einen Typ hat
      const type = pokemon.types[0];
      bgColor = typeColorsBig[type]; // Die Hintergrundfarbe für den Typ aus dem 'typeColorsBig'-Objekt abrufen
    } else if (pokemon.types.length === 2) {
      // Wenn das Pokemon zwei Typen hat
      const type1 = pokemon.types[0];
      const type2 = pokemon.types[1];
      bgColor = `linear-gradient(to right, ${typeColorsBig[type1]}, ${typeColorsBig[type2]})`; // Einen Farbverlauf zwischen den beiden Typen erstellen
    }

    buttonElement.style.background = bgColor; // Die Hintergrundfarbe des Buttons setzen
  }
}

/**
 * Hides the Pokémon background element.
 */
function hidePkmnBg() {
  document.getElementById("pkmn-bg").classList.add("d-none");
}

/**
 * Manages the visibility of the "right" button based on the Pokémon index.
 *
 * @param {number} index - The index of the current Pokémon.
 */
function manageButtonVisibility(index) {
  const rightButton = document.querySelector(".right-btn");

  // Überprüfen, ob wir uns am Ende der Liste befinden
  if (index >= allPokemon.length - 1) {
    // Wenn ja, blenden wir den 'right'-Button aus
    rightButton.style.display = "none";
  } else {
    // Wenn nein, stellen wir sicher, dass der 'right'-Button sichtbar ist
    rightButton.style.display = "";
  }
}

/**
 * Moves to the next Pokémon when the "right" button is clicked.
 */
function right() {
  const rightButton = document.querySelector(".right-btn");

  // Überprüfe, ob das nächste Pokemon das letzte in der Liste ist
  if (currentPokemonIndex + 1 < allPokemon.length) {
    // Wir sind nicht am Ende der Liste
    currentPokemonIndex++;
    renderBigCard(currentPokemonIndex);
  } else {
    // Das nächste Pokemon wäre das letzte in der Liste
    // Blende den "Right"-Button aus
    rightButton.style.display = "none";
  }
}

/**
 * Moves to the previous Pokémon when the "left" button is clicked.
 */
function left() {
  if (currentPokemonIndex > 0) {
    // Überprüfe, ob wir nicht am Anfang der Liste sind
    currentPokemonIndex--;
    renderBigCard(currentPokemonIndex);
  } else {
    // Wir sind am Anfang der Liste, schließe das Pokemon-Fenster
    hidePkmnBg();
  }
}

/**
 * Creates and adds a Chart.js bar chart to the specified canvas element.
 *
 * @param {object} baseStats - The base stats of the Pokémon.
 */
function addChart(baseStats) {
  // Holen Sie sich das Canvas-Element mit der ID "myChart"
  const ctx = document.getElementById("myChart");

  // Erstellen Sie ein neues Chart.js-Diagramm
  new Chart(ctx, {
    // Wählen Sie den Diagrammtyp (hier: Bar-Chart)
    type: "bar",
    data: {
      // Definieren Sie die Labels (x-Achse) basierend auf den Statistiknamen
      labels: Object.keys(baseStats),
      datasets: [
        {
          // Definieren Sie das Label für die Datenreihe
          label: "Pokemon Stats",
          // Definieren Sie die Datenwerte basierend auf den Statistikwerten
          data: Object.values(baseStats),
          // Definieren Sie die Eigenschaften der Balken
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)", // Rot für 'Attack'
            "rgba(54, 162, 235, 0.6)", // Blau für 'Defense'
            "rgba(255, 206, 86, 0.6)", // Gelb für 'HP'
            "rgba(75, 192, 192, 0.6)", // Türkis für 'Special Attack'
            "rgba(153, 102, 255, 0.6)", // Lila für 'Special Defense'
            "rgba(255, 159, 64, 0.6)", // Orange für 'Speed'
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          // Stellen Sie sicher, dass die y-Achse bei Null beginnt
          beginAtZero: true,
        },
      },
    },
  });
}
