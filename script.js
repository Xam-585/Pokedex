const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
let Url = "";
let offset = "0";
const DataLimit = "10";
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
    let temp = document.getElementById('content');
    for (i in myPokemons) {
    let img = myPokemons[i].sprites.front_default;
    let name = getStringFirstLetterUp(myPokemons[i].name);
    let pokedexNumber = myPokemons[i].id;
    temp.innerHTML += templatePokeCard(img, pokedexNumber,name, i)
        console.log(myPokemons[i].types[0].type.name);
    }
}

function getStringFirstLetterUp(string) {
    let String = string.substring(0, 1).toUpperCase() + string.substring(1);
    return String;
}



function generateTyps(i) {
    let temp = "";
    for (a in myPokemons[i].types) {
        temp += templateType(i, a, myPokemons[i].types[a].type.name);
    }
    return temp;
    }


function templatePokeCard(img, pokedexNumber ,name, i){
    return`
            <div id="Poke-Card${pokedexNumber}" class="Poke-Card ${myPokemons[i].types[0].type.name}">
                <div class="Poke-Card-Name">
                    <div>${name}</div>
                    <div>Nr. ${pokedexNumber}</div>
                </div>
                <div id="pokemonPic"><img src="${img}"></div>
                <div class="type-container">${generateTyps(i)}</div>
            </div>
         `
}

function templateType(i, a, type) {
    return`
           <div class="type ${myPokemons[i].types[a].type.name}">${getStringFirstLetterUp(type)}</div>
         `
}
