

function templatePokeCard(i){
    return`
            <div id="Poke-Card${myPokemons[i].id}" class="Poke-Card ${myPokemons[i].types[0].type.name}" >
                <div class="Poke-Card-Name">
                    <div class="Poke-Name">${getStringFirstLetterUp(myPokemons[i].name)}</div>
                    <div># ${myPokemons[i].id}</div>
                </div>
                <button class="pokemonPic ${myPokemons[i].types[0].type.name}" onclick="PokemonView(${i})">
                    <img src="${myPokemons[i].sprites.front_default}">
                </button>
                <div class="type-container">${generateTyps(i)}</div>
            </div>
         `
}

function templateType(i, a, type) {
    return`
           <div class="type ${myPokemons[i].types[a].type.name}">${getStringFirstLetterUp(type)}</div>
         `
}


function templatePageControl(page, maxPage) {
    return `
        <div class="page-control-box">
            <button class="page_button" onclick="getNextPageBackward()">◀</button>
            <span class="page">${page} / ${maxPage}</span>
            <button class="page_button" onclick="getNextPageForward()">▶</button>
        </div>
    `;
}

function loadingScreen() {
    return `
    <div class="load">
        <div class="loading-screen"></div>
        <div class="loading-text">Loading</div>
    </div>
    `
}

function templatePokemonDetailCard(i) {
    return `
        <div class="pokemon-detail-card ${myPokemons[i].types[0].type.name}">
            <div class="detail-header">
                <span class="detail-number">#${myPokemons[i].id}</span>
                <h2 class="detail-name">${getStringFirstLetterUp(myPokemons[i].name)}</h2>
                <button class="detail-close" onclick="closeDialog()">✕</button>
            </div>

            <div class="detail-image-box">
                <img src="${myPokemons[i].sprites.front_default}" alt="${myPokemons[i].name}">
            </div>
            <div class="Card-container">
                <button class="page-button-card ${myPokemons[i].types[0].type.name}" onclick="getNextPokemonCard(${i-1}, ${i})">◀</button>
                <div class="detail-types">${generateTyps(i)}</div>
                <button class="page-button-card ${myPokemons[i].types[0].type.name}" onclick="getNextPokemonCard(${i+1}, ${i})">▶</button>
            </div>
            <div class="detail-info-grid">
                <div class="detail-info-box">
                    <h3>Info</h3>
                    <p><strong>Height:</strong> ${myPokemons[i].height}</p>
                    <p><strong>Weigth:</strong> ${myPokemons[i].weight}</p>
                </div>
                <div class="detail-info-box">
                    <h3>Abilities</h3>
                    ${templateAbilities(myPokemons[i].abilities)}
                </div>
            </div>

            <div class="detail-stats">
                <h3>Stats</h3>
                ${templateStats(myPokemons[i].stats)}
            </div>
        </div>
    `
}

function templateAbilities(abilities) {
    let temp = "";
    for (let ability of abilities) {
        temp += `<p>${getStringFirstLetterUp(ability.ability.name)}</p>`;
    }
    return temp;
}

function templateStats(stats) {
    let temp = "";
    for (let stat of stats) {
        temp += `
            <div class="stat-row">
                <span class="stat-name">${getStringFirstLetterUp(stat.stat.name)}</span>
                <span class="stat-value">${stat.base_stat}</span>
                <div class="stat-bar">
                    <div class="stat-fill" style="width: ${Math.min(stat.base_stat, 150)}px;"></div>
                </div>
            </div>
        `;
    }
    return temp;
}

function noContentTemplate() {
    return`
            <div><h1>No Results</h1></div>
    `
}