load();

async function load() {
    const content = ReactDOM.createRoot(document.getElementById('content'));
    content.render(await portraits());
}
async function portraits() {
    const champions = await getChampions();
    return (
        <div className="champion-portrait">
            {
                champions.map((champion, index) => (
                    <div className={"card champion-card"}>
                        <img src={champion.image} alt={champion.id} className="card-img-top"/>
                        <div className={"card-body"}>
                            <h5 className={"card-title"}>{champion.name}</h5>
                            <p className={"card-text"}>{champion.title}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

async function getPatch() {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const data = await response.json();
    return data[0];
}

async function getChampions() {
    const patch = await getPatch();
    // Get champion roster from https://ddragon.leagueoflegends.com/cdn/15.10.1/data/en_US/champion.json
    // Then for each champion, store the name of the champion in a new array and return that array. We only need the names.
    return fetch(`https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion.json`)
        .then(response => response.json())
        .then(data => {
            return Object.values(data.data).map(champion => {
                return {
                    id: champion.id,
                    image: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`,
                    name: champion.name,
                    title: champion.title
                };
            });
        })
        .catch(error => {
            console.error('Error fetching champions:', error);
            throw error;
        });
}