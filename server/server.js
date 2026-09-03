require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();
app.use(cors());

const teams = [
    'atl/atlanta-hawks',
    'bos/boston-celtics',
    'bkn/brooklyn-nets',
    'cha/charlotte-hornets',
    'chi/chicago-bulls',
    'cle/cleveland-cavaliers',
    'dal/dallas-mavericks',
    'den/denver-nuggets',
    'det/detroit-pistons',
    'gs/golden-state-warriors',
    'hou/houston-rockets',
    'ind/indiana-pacers',
    'lac/los-angeles-clippers',
    'lal/los-angeles-lakers',
    'mem/memphis-grizzlies',
    'mia/miami-heat',
    'mil/milwaukee-bucks',
    'min/minnesota-timberwolves',
    'no/new-orleans-pelicans',
    'ny/new-york-knicks',
    'okc/oklahoma-city-thunder',
    'orl/orlando-magic',
    'phi/philadelphia-76ers',
    'phx/phoenix-suns',
    'por/portland-trail-blazers',
    'sac/sacramento-kings',
    'sa/san-antonio-spurs',
    'tor/toronto-raptors',
    'utah/utah-jazz',
    'wsh/washington-wizards'
];

const players = [];

const getPlayers = async () => {
    console.time("Retrieved all players");

    // Get all team rosters concurrently
    const requests = teams.map(async (team) => {
        const teamName = team.split('/')[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const teamURL = `https://www.espn.com/nba/team/roster/_/name/${team}`;

        try {
            const response = await axios.get(teamURL);
            const $ = cheerio.load(response.data);

            $('table').eq(0).find('tbody tr').each((_, row) => {
                const tds = $(row).find('td');
                const nameLink = tds.eq(1).find('div');

                const name = nameLink.find('a').text();
                const number = nameLink.find('span').text();
                const link = nameLink.find('a').attr('href');
                const id = link.replace(/\D/g, '');

                const position = tds.eq(2).find('div').text();
                const age = tds.eq(3).find('div').text();
                const height = tds.eq(4).find('div').text();
                const college = tds.eq(6).find('div').text();

                players.push({
                    name,
                    number,
                    position,
                    age,
                    height,
                    college,
                    teamName,
                    id
                });
            });

        } catch (error) {
            console.error(`Failed at ${team}:`, error.message);
        }
    });

    await Promise.all(requests);

    console.log(`Retrieved ${players.length} players`);
    console.log("Retrieving player statistics...");

    // Limit concurrent player requests
    const batchSize = 10;

    for (let i = 0; i < players.length; i += batchSize) {
        const batch = players.slice(i, i + batchSize);

        await Promise.all(batch.map(async (player) => {
            const playerURL =
                `https://www.espn.com/nba/player/_/id/${player.id}`;

            try {
                const response = await axios.get(playerURL);
                const $ = cheerio.load(response.data);

                const tds = $('[data-testid="playerStats"]')
                    .find('.Table__Scroller table tbody tr')
                    .first()
                    .find('td');

                const stats = {
                    rebounds: Number(tds.eq(5).text().trim()),
                    assists: Number(tds.eq(6).text().trim()),
                    blocks: Number(tds.eq(7).text().trim()),
                    steals: Number(tds.eq(8).text().trim()),
                    points: Number(tds.eq(11).text().trim())
                };

                const notoriety =
                    stats.points +
                    (stats.rebounds * 0.5) +
                    (stats.assists * 0.75) +
                    (stats.blocks * 1.5) +
                    (stats.steals * 1.5);

                player.stats = stats;
                player.notoriety = notoriety;

            } catch (error) {
                console.error(
                    `Failed to retrieve stats for ${player.name}:`,
                    error.message
                );

                player.stats = [];
            }
        }));

        console.log(
            `Processed ${Math.min(i + batchSize, players.length)}/${players.length} players`
        );
    }

    console.timeEnd("Retrieved all players");

    fs.writeFileSync(
        '../client/public/players.json',
        JSON.stringify(players, null, 2)
    );

    console.log(`Wrote ${players.length} players to players.json`);
};

getPlayers();

// GET A RANDOM PLAYER
// app.get('/random', (req, res) => {
//     res.json(players[Math.floor(Math.random() * players.length)]);
// });

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// GET FOUR RANDOM PLAYERS EXCLUDING AN ID
app.get('/random-four', (req, res) => {
    const randomFour = shuffleArray(players.filter(player => player.id !== req.query.excludeId)).slice(-4);
    res.json(randomFour);
});

app.get("/search", async (req, res) => {
    const query = req.query.name?.toLowerCase() || '';
    let results = [];
    if(/^-?[a-z ]+$/.test(query)){
        results = players.filter(player =>
            player.name.toLowerCase().replace(/[^a-z-\s]/g, '').includes(query)
        );
    }
    else if(/^-{2,}[a-z ]+$/.test(query)){
        results = players.filter(player =>
            player.name.toLowerCase().replace(/[^a-z-\s]/g, '').startsWith(query)
        );
    }
    res.json(results);
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> console.log(`Listening on ${PORT}...`));

