
let patch;
let champions;
let unmarkedChampions;
let markedChampions = [];
load();

document.getElementById('champion-input').addEventListener('keyup', function(event) {
    let guess = event.target.value.toLowerCase();
    if(containsIgnoreCase(markedChampions, guess)) {
        if(guess != 'vi')
            event.target.value = '';
        return;
    }
    if(containsIgnoreCase(unmarkedChampions, guess)) {
        const championID = findChampionID(guess);
        markedChampions.push(championID);
        // Remove the guess from unmarkedChampions
        unmarkedChampions = unmarkedChampions.filter(champion => champion !== championID);

        // Get index of guess in champions
        console.log(guess, championID);

        const index = champions.indexOf(championID);

        const helmetBroIcon = document.getElementsByClassName('champ-id-' + index)[0];
        helmetBroIcon.src = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${championID}.png`;
        helmetBroIcon.alt = `${championID} Icon`;
        helmetBroIcon.classList.add('helmet-bro-icon');
        helmetBroIcon.classList.add('champ-id-' + count);
        if(championID === 'Neeko') {
            helmetBroIcon.classList.add('neeko-transform');
        }

        const neekoIcon = document.getElementsByClassName('neeko-transform')[0];
        if(neekoIcon != null) {
            neekoIcon.src = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${championID}.png`;
        }

        event.target.value = '';
    }
})

function containsIgnoreCase(array, value) {
    return array.some(item => (
        item.toLowerCase() === value.replace(/[ .']/g, '').replace(/wukong/gi, 'monkeyking').toLowerCase()
    ));
}

function findChampionID(championName) {
    // Find the champion ID in the champions array
    for(const champion of champions) {
        if(champion.toLowerCase() === championName.replace(/[ .']/g, '').replace(/wukong/gi, 'monkeyking').toLowerCase()) {
            return champion;
        }
    }
    return null;
}

async function load() {
    // Get the current patch version
    patch = await getPatch();

    // Get the champion roster
    champions = await getChampions();
    unmarkedChampions = await getChampions();
    // for each champions, add a helmet_bro.png icon under the div#champion-icons
    for (const champion of champions) {
        // Add Helmet Bro icon
        addHelmetBroIcon(champion);
    }
}
let count = 0;
function addHelmetBroIcon(championName) {
    const championIcon = document.getElementById(`champion-icons`);
    const helmetBroIcon = document.createElement('img');
    helmetBroIcon.src = 'resources/helmet_bro.png';
    helmetBroIcon.alt = 'Helmet Bro Icon';
    helmetBroIcon.classList.add('helmet-bro-icon');
    helmetBroIcon.classList.add('champ-id-' + count);
    //helmetBroIcon.classList.add('img-thumbnail');
    championIcon.appendChild(helmetBroIcon);
    count++;
}

async function getPatch() {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const data = await response.json();
    return data[0];
}

async function getChampions() {
    // Get champion roster from https://ddragon.leagueoflegends.com/cdn/15.10.1/data/en_US/champion.json
    // Then for each champion, store the name of the champion in a new array and return that array. We only need the names.
    return fetch(`https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion.json`)
        .then(response => response.json())
        .then(data => {
            return Object.values(data.data).map(champion => champion.id);
        })
        .catch(error => {
            console.error('Error fetching champions:', error);
            throw error;
        });
}