let pokemonHistory= [];

document.getElementById('search').addEventListener('click', () => {
     displayPokemon();
     document.getElementById('pokemon').value = "";
     document.getElementById('reset').disabled = true;
});


document.getElementById('reset').addEventListener('click', () => {
    document.getElementById('pokemon-container').innerHTML = "";
    showAlert("Se reestablecio");
    document.getElementById('search').disabled = false;
});

document.getElementById('history').addEventListener('click', () => {
    displayPokemon();
    pokemonHistory.forEach((pokemon) => {
        console.log(pokemon);
    });

});

document.getElementById('water').addEventListener('click', () => {
    displayPokemon();
    const waterPokemons = pokemonHistory.filter((pokemon) => {
        return pokemon.types.some((type) => type.type.name === 'water');
    });

    if (waterPokemons.length > 0) {
        const element = document.createElement('div');
        waterPokemons.forEach((pokemon) => {
            element.innerHTML = `<img src="squirtle_squad.png">`;
        });
        document.getElementById('pokemon-container').appendChild(element);
        showAlert("Si existe!")
    }
});

async function displayPokemon() {
    const pokemonName = document.getElementById('pokemon').value;
    if (pokemonName === "") {
        showAlert("Escribe un nombre");
        return;
    }
    const pokemon = await getPokemon(pokemonName);
    addPokemon(pokemon);
    
}

async function getPokemon(name) {
    try{
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (response.status === 404) {
        showAlert("No se encontro el pokemon");
        return;
    }
    return await response.json();
} catch(err){
    showAlert("Error al intentar conectar con el servidor")
}
}

function addPokemon(pokemon) {
    pokemonHistory.push(pokemon);
    pokemonHistory.sort((a, b)=> {
    return a.base_experience - b.base_experience;
    });

    const pokemonList = document.getElementById('pokemon-container');
    const element = document.createElement('div');
    element.innerHTML = `
        <img src="${pokemon.sprites.front_default}">
        <strong>Id</strong>: ${pokemon.id}
        <strong>Name</strong>: ${pokemon.name}
        <strong>Base Experience</strong>: ${pokemon.base_experience}
        <strong>Type</strong>: ${pokemon.types[0].type.name}
        <strong>First Ability</strong>: ${pokemon.abilities[0].ability.name}
    `;
    pokemonList.appendChild(element);
    if (pokemonList.childElementCount === 3) {
        disableButtons()
        showAlert("Ya tienes 3 pokemons");
        document.getElementById('search').disabled = element;
        document.getElementById('reset').disabled = false;
    }

    function disableButtons(status){
        document.getElementById('reset').disabled = status;
        document.getElementById('search').disabled = status;

    }
}

function showAlert(message){
    const alertContainer = document.getElementById("alert_container");
    alertContainer.innerHTML= "";
    const element = document.createElement("div");
    element.innerHTML = `
    <h2>${message}</h2>
    
    `;
    alertContainer.appendChild(element);
}

