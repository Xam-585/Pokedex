const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
let Url = "";
let offset = 0;
const DataLimit = 24;
let MaxNumberPokemon = 0;
let Page = 1;
let MaxPage = 0;
let myPokemons = [];
let SearchList = [];
let activeList = [];
let CurrentSearchList = [];

// load
function loadData() {
    checkLocalSorage();
}

//API
async function loadAPI() {
    generateURL(offset, 2000);
    let userResponse = await loadDataApi(Url);
    getMaxPage(userResponse.count);
    let UserKeysArray = userResponse.results;
    SearchList = [];
    for (let i = 0; i < UserKeysArray.length; i++) {
        pushInSearch(UserKeysArray[i], SearchList)
    }
    await loadPagePokemonData(SearchList);
    generateContent(true);
}

async function loadDataApi(path) {
    let response = await fetch(path);
    return await response.json();
}

async function loadPagePokemonData(activeList) {
    myPokemons = [];
    let promises = [];
    for (let i = offset; i < offset + DataLimit && i < activeList.length; i++) {
        promises.push(loadDataApi(activeList[i].url));
    }
    let result = await Promise.all(promises);
    console.log(result);
    for (let i = 0; i < result.length; i++) {
        pushInMyPokemons(result[i]);
    }
} 

function generateURL(Off, Limit) {
    return Url = BASE_URL + "?offset=" + Off + "&limit=" + Limit;
}

//API Data 
function pushInSearch(para, object) {
    object.push({
        name: para.name,
        url: para.url,
    });
}

function getMaxPage(count) {
    MaxNumberPokemon = count;
    MaxPage = Math.ceil(MaxNumberPokemon / DataLimit);
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
    activeList = SearchList;
    generateContent(true);
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

//Content / Rendering
function renderContent() {
    let Refdocument = document.getElementById('content');
    Refdocument.innerHTML = "";
    let temp = "";
    for (i in myPokemons) {
        temp += templatePokeCard(i)
    }
    Refdocument.innerHTML = temp;
}

function PokemonView(i) {
    let dialogRef = openDialog();
    dialogRef.innerHTML = templatePokemonDetailCard(i);
}

function loadPageControl() {
    let control = document.getElementById("Page-control");
    control.innerHTML = templatePageControl(Page, MaxPage);
}

// Navigation
function getNextPageForward() {
    if (Page !== MaxPage) {
        pageChange (1,);
    }
}

function getNextPageBackward() {
    if (Page > 1) {
       pageChange (-1,); 
    }
}

async function pageChange(signChange){
    let content = document.getElementById('content');
    content.innerHTML = "";
    Page += 1 * signChange;
    offset = offset + DataLimit * signChange;
    startLoadingScreen();
    await loadPagePokemonData(activeList);
    generateContent(false)
}

    // Search function
async function search() {
    let RefInput = document.getElementById('search-input').value.trim().toLowerCase();
    if (isDefaultState(RefInput)) {
        return;
    }
    resetPagination();
    if(updateActiveList(RefInput)) {
        startLoadingScreen();
        getMaxPage(activeList.length);
        await loadPagePokemonData(activeList);          
        generateContent(false); 
    }
}

// helpers
function updateActiveList(RefInput) {
    if (RefInput !== "") {
        CurrentSearchList = SearchList.filter(x => x.name.toLowerCase().includes(RefInput));
        activeList = CurrentSearchList;
        if (CurrentSearchList.length === 0) {
            noMatchesDialog();
            return false;
        }
    }
    else {
        activeList = SearchList;
    } 
    return true;
}

function resetPagination() {
    Page = 1;  
    offset = 0;
}

function isDefaultState(Refinput) {
    return Refinput === "" && activeList === SearchList;
}

function generateContent(safe) {
    renderContent();
    loadPageControl();
    closeLoadingScreen();
    if (safe === true) {
        localStorageSafe();
    }
}

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

function getSectionContenId() {
    return document.getElementById('content');
}

function getSectionPageControlId() {
    return document.getElementById('Page-control');
}

function getDialogId() {
    return document.getElementById('dialog');
}

// Dialog

function noMatchesDialog() {
    dNoneAddClass();
    let dialogRef = openDialog();
    dialogRef.innerHTML = noContentTemplate();
}

function startLoadingScreen() {
    dNoneAddClass();
    let dialogRef = openDialog();
    dialogRef.innerHTML = loadingScreen();
}

function closeLoadingScreen() {
    dNoneRemoveClass();
    closeDialog();    
}

function openDialog() { 
    let dialogRef = getDialogId();
    dialogRef.showModal();
    dialogRef.classList.add('open');
    document.body.classList.add('no-scroll');
    return dialogRef;
}

function closeDialog() { 
    const dialogRef = getDialogId();
    dialogRef.innerHTML = "";
    dialogRef.close();
    dialogRef.classList.remove('open');
    document.body.classList.remove('no-scroll');
}

function dNoneAddClass() {
    let content = getSectionContenId();
    let Pagecontrol = getSectionPageControlId();
    content.classList.add('d-none');
    Pagecontrol.classList.add('d-none');
}

function dNoneRemoveClass() {
    let content = getSectionContenId();
    let Pagecontrol = getSectionPageControlId();
    content.classList.remove('d-none');
    Pagecontrol.classList.remove('d-none');
}

