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
  // Weitere Typen und Farben hier hinzufügen
};

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
  // Weitere Typen und Farben hier hinzufügen
};

let allPokemon = []; // Ein Array zur Speicherung aller Pokemon-Daten
let limited = 40;
let offseted = 0;
let loadedPokemonCount = 0; // Zähler für die bereits geladenen Pokemon
const loadIncrement = 40; // Anzahl der Pokemon, die bei jedem Klick geladen werden
let currentPokemonIndex = 0;

async function loadPokemon(offset = 0) {
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
  

  renderPokemon();
  setPokemonBackgroundColors();
  // bgSwich();
  document
    .getElementById("load-more-btn")
    .addEventListener("click", loadMorePokemon);
  document.getElementById("load-more-btn").style.display = "block";
  loadedPokemonCount += loadIncrement; // Zähler erhöhen
}

function loadMorePokemon() {
  loadPokemon(loadedPokemonCount);
}

async function fetchIndividualPokemonData(url) {
  let response = await fetch(url); // API-Anfrage für das individuelle Pokemon senden und auf die Antwort warten
  let data = await response.json(); // JSON-Daten der API-Antwort extrahieren

  let id = String(data["id"]).padStart(3, "0"); // Pokemon-ID im gewünschten Format generieren und als String speichern
  let name = data["name"]; // Pokemon-Namen speichern
  let image = data["sprites"]["other"]["dream_world"]["front_default"]; // Bild des Pokemon speichern

  let types = [];
  for (let i = 0; i < data["types"].length; i++) {
    types.push(data["types"][i].type.name); // Die Pokemon-Typen aus den JSON-Daten extrahieren und in das 'types'-Array speichern
  }

  let stats = data["stats"]; // Alle Stats des Pokemon speichern
  let baseStats = {};
  for (let j = 0; j < stats.length; j++) {
    let statName = stats[j].stat.name; // Namen des Stats speichern
    let baseStat = stats[j].base_stat; // Base-Stat des Stats speichern
    baseStats[statName] = baseStat; // Dem 'baseStats'-Objekt den Stat-Namen als Schlüssel und den Base-Stat als Wert hinzufügen
  }

  return { id, name, image, types, baseStats }; // Ein Objekt mit den extrahierten Daten zurückgeben
}

let renderedPokemonCount = 0; // Zähler für die bereits gerenderten Pokemon

function renderPokemon() {
  const container = document.getElementById("pokemonName");

  // Starte von dem Punkt, an dem wir beim letzten Mal aufgehört haben
  for (let i = renderedPokemonCount; i < allPokemon.length; i++) {
    let pokemon = allPokemon[i];
    let capitalized =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    let typesHtml = "";
    for (let j = 0; j < pokemon.types.length; j++) {
      let type = pokemon.types[j];
      typesHtml += `<span class="type type-${type.toLowerCase()}">${type}</span>`;
    }

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

    container.innerHTML += html;
  }

  // Aktualisiere den Zähler für die bereits gerenderten Pokemon
  renderedPokemonCount = allPokemon.length;
}

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

  let baseStats = {
    Attack: pokemon.baseStats.attack, // Der Angriffs-Stat des Pokemons wird abgerufen
    Defense: pokemon.baseStats.defense, // Der Verteidigungs-Stat des Pokemons wird abgerufen
    HP: pokemon.baseStats.hp, // Der KP-Stat (KP = Kraftpunkte) des Pokemons wird abgerufen
    "Special Attack": pokemon.baseStats["special-attack"], // Der Spezial-Angriffs-Stat des Pokemons wird abgerufen
    "Special Defense": pokemon.baseStats["special-defense"], // Der Spezial-Verteidigungs-Stat des Pokemons wird abgerufen
    Speed: pokemon.baseStats.speed, // Der Geschwindigkeits-Stat des Pokemons wird abgerufen
  };

  addChart(baseStats); // Das Diagramm mit den Basis-Stats des Pokemons wird erstellt und eingefügt

  document.getElementById("pkmn-bg").classList.remove("d-none"); // Die Klasse 'd-none' wird vom Hintergrund-Element entfernt, um es anzuzeigen
  setBigCardBackgroundColor(); // Die Hintergrundfarbe der großen Karte wird festgelegt
  setButtonBackgroundColors(); // Die Hintergrundfarben der Buttons werden festgelegt
}

function createBigCardHtml(pokemon, capitalized) {
  let typesHtml = "";
  for (let i = 0; i < pokemon.types.length; i++) {
    let type = pokemon.types[i];
    typesHtml += `<span class="type type-${type.toLowerCase()}">${type}</span>`;
  }

  return `
    <div id="testOne" class="bgTwo">
      <button onclick="left()" class="left-btn"><img src="./img/left.png" alt=""></button>
      <button onclick="right()" class="right-btn"><img src="./img/right.png" alt=""></button>
      <div class="like-close">
        <img  onclick="hidePkmnBg()" class="icon-width cursor-pointer" src="./img/icons8-schließen-67.png" alt="">
        <img class="icon-width cursor-pointer" src="./img/heart-white.png" alt="">
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

function createInfoCardHtml() {
  return `
    <canvas id="myChart"></canvas>
  `;
}

function setPokemonBackgroundColors() {
  const pokemonElements = document.querySelectorAll(".pkmn-name-img"); // Alle Elemente mit der Klasse "pkmn-name-img" aus dem DOM abrufen

  for (let i = 0; i < pokemonElements.length; i++) {
    const pokemonElement = pokemonElements[i]; // Das aktuelle Pokemon-Element
    const types = allPokemon[i].types; // Die Typen des aktuellen Pokemons aus dem Array 'allPokemon' abrufen

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

function hidePkmnBg() {
  document.getElementById("pkmn-bg").classList.add("d-none");
}

function right() {
  if (currentPokemonIndex < allPokemon.length - 1) {
    // Überprüfe, ob wir nicht am Ende der Liste sind
    currentPokemonIndex++;
    renderBigCard(currentPokemonIndex);
  }
}

function left() {
  if (currentPokemonIndex > 0) {
    // Überprüfe, ob wir nicht am Anfang der Liste sind
    currentPokemonIndex--;
    renderBigCard(currentPokemonIndex);
  }
}

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
          label: "# of Votes",
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

// Beispiele für den Zugriff auf Daten:
// allPokemon[0].id      // ID des ersten Pokémon
// allPokemon[0].name    // Name des ersten Pokémon
// allPokemon[0].image   // Bild des ersten Pokémon
// allPokemon[0].types   // Typen des ersten Pokémon
