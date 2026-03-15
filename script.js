const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
let Url = "";
let offset = "0";
const DataLimit = "15";
const PokeKey = ["name", "order", "ability", "forms", "height", "weight", "types"]
//const PokeKeyMore = ["types", "spirits"];
let myData = [];
let myPokemons = [];



function generateURL() {
    Url = BASE_URL + "?offset=" + offset + "&limit=" + DataLimit;
}


async function loadData() {
    generateURL();
    let userResponse = await loadDataApi(Url);
    let UserKeysArray = userResponse.results;
    for (i in UserKeysArray) {
        myData.push(UserKeysArray[i])
    }
    await loadPagePokemonData();
    test();
}

async function loadDataApi(path) {
    let response = await fetch(path);
    return responseToJson = await response.json();
}


async function loadPokemonURL(i) {
    let response = await fetch(myData[i].url);
    let pokemonUrl = response.url;
    return pokemonUrl;
}

async function loadPagePokemonData() {
    for (i in myData) {
        let userResponse = await loadDataApi(await loadPokemonURL(i));
        myPokemons.push(userResponse);
    }
    console.log(myPokemons);
} 

function getPokemonData(i, key, key2) {
    let pokemon = myPokemons[i][key][key2];
    console.log(pokemon);
    return pokemon;
}

function test() {
    let temp = document.getElementById('div');
    for (i in myPokemons) {
    let img = myPokemons[i].sprites.front_default;
    let name = myPokemons[i].name;
    let pokedexNumber = myPokemons[i].id;
    let tempType = "";
    for (a in myPokemons[i].types) {
        tempType += templateType(Number(a) +1, myPokemons[i].types[a].type.name);
    }
    temp.innerHTML += template(img, pokedexNumber,name) + tempType;
    }
}


function template(img, pokedexNumber ,name) {
    return`
            <div id="pokemonPic"><img src="${img}"></div>
            <div>Nr. ${pokedexNumber}</div>
            <div>${name}</div>
         `
}

function templateType(i, type) {
    return`
           <div>Type${i}: ${type}</div>
         `
}
