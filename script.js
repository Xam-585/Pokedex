const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
let Url = "";
let offset = "0";
const DataLimit = "28";
let Page = 1;
let MaxPage = 0;
let myData = [];
let myPokemons = [];
let SearchList = [];

// load
function loadData() {
    checkLocalSorage();
    test();
    loadPageControl();
}





// push necessary data from api 

function pushInMyData(para, object) {
    object.push({
        name: para.name,
        url: para.url,
    });
}

function pushInMyPokemons(para, i) {
    myPokemons.push({
        id: para.id,
        name: para.name,
        sprites: para.sprites,
        types: para.types,
        weight: para.weight,
        height: para.height
    });
}

//API

async function loadDataApi(path) {
    let response = await fetch(path);
    return responseToJson = await response.json();
}

async function loadPagePokemonData() {
    for (i in myData) {
        let userResponse = await loadDataApi(await loadPokemonURL(i));
        pushInMyPokemons(userResponse, i);
    }
} 

async function loadPokemonURL(i) {
    let response = await fetch(myData[i].url);
    let pokemonUrl = response.url;
    return pokemonUrl;
}

async function loadAPI() {
    generateURL(offset, 2000);
    let userResponse = await loadDataApi(Url);
    let UserKeysArray = userResponse.results;
    MaxPage = Math.ceil(Number(userResponse.count) / Number(DataLimit))
    for (i in UserKeysArray) {
        pushInMyData(UserKeysArray[i], SearchList)
    }
    loopPushData(offset, DataLimit);
    await loadPagePokemonData();
    localStorageSafe();
}

function loopPushData(start, end) {
    for (let i = start; i < end; i++) {
        pushInMyData(SearchList[i], myData);
    }
}

async function loadAllPokemonList() {
    let allUrl = generateURL(offset, 2000);
    let userResponse = await loadDataApi(allUrl);
    let UserKeysArray = userResponse.results;
    for (i in UserKeysArray) {
        
    }
    
}
// localStorage

function checkLocalSorage() {
    let localdata = getFromLocalStorage("myData");
    let localpokemon = getFromLocalStorage("myPokemons");
    let localPage = getFromLocalStorage("Page");
    let localMaxPage = getFromLocalStorage("MaxPage");
    let localsearchList = getFromLocalStorage("SearchList");
    if (localdata !== null && localpokemon !== null && localPage !== null && localMaxPage !== null && localsearchList !== null) {
        getLocalData(localdata, localpokemon, localPage, localMaxPage, localsearchList);
    }
    else {
        loadAPI();
    }
}

function getLocalData(localdata, localpokemon, localPage, localMaxPage, localsearchList) {
    myData = localdata;
    myPokemons = localpokemon;
    Page = localPage;
    MaxPage = localMaxPage;
    SearchList = localsearchList;
}

function localStorageSafe() {
    saveToLocalStorage("myData",JSON.stringify(myData));
    saveToLocalStorage("myPokemons", JSON.stringify(myPokemons));
    saveToLocalStorage("Page", Page);
    saveToLocalStorage("MaxPage", MaxPage);
    saveToLocalStorage("SearchList", SearchList);
}

function saveToLocalStorage(key, object) {
        localStorage.setItem(key, object)
    }

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}



function generateURL(Off, Limit) {
    Url = BASE_URL + "?offset=" + Off + "&limit=" + Limit;
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

// Page Control





function loadPageControl() {
    let control = document.getElementById("Page-control");
    control.innerHTML = templatePageControl(Page, MaxPage);
}

// get functions

function getPokemonData(i, key, key2) {
    let pokemon = myPokemons[i][key][key2];
    return pokemon;
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
