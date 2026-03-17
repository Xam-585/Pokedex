

function templatePokeCard(img, pokedexNumber ,name, i){
    return`
            <div id="Poke-Card${pokedexNumber}" class="Poke-Card ${myPokemons[i].types[0].type.name}" >
                <div class="Poke-Card-Name">
                    <div>${name}</div>
                    <div>Nr. ${pokedexNumber}</div>
                </div>
                <button class="pokemonPic ${myPokemons[i].types[0].type.name}"><img src="${img}"></button onclick="">
                <div class="type-container">${generateTyps(i)}</div>
            </div>
         `
}

function templateType(i, a, type) {
    return`
           <button onclick="" class="type ${myPokemons[i].types[a].type.name}">${getStringFirstLetterUp(type)}</button>
         `
}


function templatePageControl(page, maxPage) {
    return `
            <button class="page_button" onclick="getNextPageBackward()"><</button>
            <span class="page"> Page: ${page} | ${maxPage}</span>
            <button class="page_button" onclick="getNextPageForward()">></button>
        `
}

function loadingScreen() {
    return `
    <div class="load">
        <div class="loading-screen"></div>
        <div class="loading-text">Loading</div>
    </div>
    `
}