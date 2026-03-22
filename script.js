const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
let Url = "";
let offset = 0;
const DataLimit = 28;
let MaxNumberPokemon = 0;
let Page = 1;
let MaxPage = 0;
let myPokemons = [];
let SearchList = [];

// load
function loadData() {
    checkLocalSorage();
}

// push necessary data from api 

function pushInSearch(para, object) {
    object.push({
        name: para.name,
        url: para.url,
    });
}

function pushInMyPokemons(para) {
    myPokemons.push({
        id: para.id,
        name: para.name,
        sprites: para.sprites,
        types: para.types,
        weight: para.weight,
        height: para.height,
        stats: para.stats,
        abilities: para.abilities
    });
}

//API
async function loadDataApi(path) {
    let response = await fetch(path);
    return await response.json();
}

async function loadPagePokemonData() {
    myPokemons = [];

    for (let i = offset; i < offset + DataLimit && i < SearchList.length; i++) {
        let userResponse = await loadDataApi(SearchList[i].url);
        pushInMyPokemons(userResponse);
    }
} 

async function loadAPI() {
    generateURL(offset, 2000);
    let userResponse = await loadDataApi(Url);
    
    getMaxPage(userResponse.count);

    let UserKeysArray = userResponse.results;
    SearchList = [];
    for (i in UserKeysArray) {
        pushInSearch(UserKeysArray[i], SearchList)
    }
    await loadPagePokemonData();
    generateContent();
    localStorageSafe();
    closeLoadingScreen();
}

function getMaxPage(count) {
    MaxNumberPokemon = count;
    MaxPage = Math.ceil(MaxNumberPokemon / DataLimit);
}

//Content 

function PokemonView(i) {
    let dialogRef = openDialog();
    dialogRef.innerHTML = templatePokemonDetailCard(i);
}


    
// localStorage

function checkLocalSorage() {
    let localMaxNumberPokemon = getFromLocalStorage("MaxNumberPokemon");
    let localpokemon = getFromLocalStorage("myPokemons");
    let localPage = getFromLocalStorage("Page");
    let localMaxPage = getFromLocalStorage("MaxPage");
    let localsearchList = getFromLocalStorage("SearchList");
    if (localMaxNumberPokemon !== null && localpokemon !== null && localPage !== null && localMaxPage !== null && localsearchList !== null) {
        getLocalData(localMaxNumberPokemon, localpokemon, localPage, localMaxPage, localsearchList);
    }
    else {
        startLoadingScreen();
        loadAPI();
    }
}

function getLocalData(localMaxNumberPokemon, localpokemon, localPage, localMaxPage, localsearchList) {
    MaxNumberPokemon = localMaxNumberPokemon
    myPokemons = localpokemon;
    Page = localPage;
    MaxPage = localMaxPage;
    SearchList = localsearchList;
    generateContent();
}

function localStorageSafe() {
    saveToLocalStorage("myPokemons", myPokemons);
    saveToLocalStorage("Page", Page);
    saveToLocalStorage("MaxPage", MaxPage);
    saveToLocalStorage("SearchList", SearchList);
    saveToLocalStorage("MaxNumberPokemon", MaxNumberPokemon)
}

function saveToLocalStorage(key, object) {
        localStorage.setItem(key, JSON.stringify(object));
    }

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function generateURL(Off, Limit) {
    return Url = BASE_URL + "?offset=" + Off + "&limit=" + Limit;
}

function generateContent() {
    let temp = document.getElementById('content');
    temp.innerHTML = "";
    for (i in myPokemons) {
    temp.innerHTML += templatePokeCard(i)
    }
    localStorageSafe();
    loadPageControl();
}

// Page Control

function getNextPageForward() {
    if (Page !== MaxPage) {
        pageChange (1);
    }
}

function getNextPageBackward() {
    if (Page > 1) {
       pageChange (-1); 
    }
}

async function pageChange (signChange){
    let content = document.getElementById('content');
    content.innerHTML = "";
    Page += 1 * signChange;
    offset = offset + DataLimit * signChange;

    startLoadingScreen();
    await loadPagePokemonData();
    generateContent();
    closeLoadingScreen();
    localStorageSafe();
}

function loadPageControl() {
    let control = document.getElementById("Page-control");
    control.innerHTML = templatePageControl(Page, MaxPage);
}

// get functions

function getStringFirstLetterUp(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
}

function formatHeight(height) {
    return (height / 10).toFixed(1) + " m";
}

function formatWeight(weight) {
    return (weight / 10).toFixed(1) + " kg";
}

function formatStatName(name) {
    switch (name) {
        case "hp": return "HP";
        case "attack": return "Attack";
        case "defense": return "Defense";
        case "special-attack": return "Sp. Atk";
        case "special-defense": return "Sp. Def";
        case "speed": return "Speed";
        default: return getStringFirstLetterUp(name);
    }
}

function generateTyps(i) {
    let temp = "";
    for (a in myPokemons[i].types) {
        temp += templateType(i, a, myPokemons[i].types[a].type.name);
    }
    return temp;
}

    // Dialog

    function startLoadingScreen() {
        let content = document.getElementById('content');
        let Pagecontrol = document.getElementById('Page-control');
        content.classList.add('d-none');
        Pagecontrol.classList.add('d-none');
        let dialogRef = openDialog();
        dialogRef.innerHTML = loadingScreen();
    }

    function closeLoadingScreen() {
        let content = document.getElementById('content');
        let Pagecontrol = document.getElementById('Page-control');
        content.classList.remove('d-none');
        Pagecontrol.classList.remove('d-none');
        closeDialog();    
    }

    function openDialog() { 
        let dialogRef = document.getElementById('dialog');
        dialogRef.showModal();
        dialogRef.classList.add('open');
        document.body.classList.add('no-scroll');
        return dialogRef;
    }


    function closeDialog() { 
        const dialogRef = document.getElementById('dialog');
        dialogRef.innerHTML = "";
        dialogRef.close();
        dialogRef.classList.remove('open');
        document.body.classList.remove('no-scroll');
    }
