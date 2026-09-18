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
        const [abbreviation, slug] = team.split('/');

        const teamName = slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
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
                    team: [teamName, abbreviation],
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

    const batchSize = 10;
    for (let i = 0; i < players.length; i += batchSize) {
        const batch = players.slice(i, i + batchSize);

        await Promise.all(batch.map(async (player) => {
            const playerURL =
                `https://www.espn.com/nba/player/stats/_/id/${player.id}`;

            try {
                const response = await axios.get(playerURL);
                const $ = cheerio.load(response.data);

                const tables = $('table');

                const getTdText = (cells, index) => {
                    return Number($(cells[index - 1]).text().trim());
                };

                const table2 = tables.eq(1);
                const lastRowTable2 = table2.find('tbody tr').last();
                const tdsTable2 = lastRowTable2.find('td');

                const secondLastRowTable2 = table2.find('tbody tr').eq(-2);
                const secondTdsTable2 = secondLastRowTable2.find('td');

                const rpg = getTdText(secondTdsTable2, 12);
                const apg = getTdText(secondTdsTable2, 13);
                const bpg = getTdText(secondTdsTable2, 14);
                const spg = getTdText(secondTdsTable2, 15);
                const ppg = getTdText(secondTdsTable2, 18);

                const gamesPlayed = getTdText(tdsTable2, 1);
                const mpg = getTdText(tdsTable2, 3);

                const table4 = tables.eq(3);
                const lastRowTable4 = table4.find('tbody tr').last();
                const tdsTable4 = lastRowTable4.find('td');

                const careerTotalRebounds = getTdText(tdsTable4, 9);
                const careerTotalAssists = getTdText(tdsTable4, 10);
                const careerTotalPoints = getTdText(tdsTable4, 15);

                const element = $('div:contains(", Pk")').first();

                let draftPick = 0;

                if (element.length > 0) {
                    const text = element.text().trim();
                    const match = text.match(/Pk\s*(\d+)/i);
                    if (match) draftPick = parseInt(match[1], 10);
                }

                player.pick = draftPick;
                player.stats = {
                    gamesPlayed,
                    careerTotalPoints,
                    careerTotalRebounds,
                    careerTotalAssists,
                    ppg,
                    rpg,
                    apg,
                    bpg,
                    spg,
                    mpg
                };

                // ========================================
                // START
                // ========================================

                let points = 1000;

                // ========================================
                // 1. DRAFT PEDIGREE
                // ========================================

                if (gamesPlayed === 0) {

                    if (draftPick >= 1 && draftPick <= 60) {

                        const draftScore =
                            600 +
                            400 * Math.pow(
                                (draftPick - 1) / 59,
                                0.35
                            );

                        points = Math.min(points, draftScore);
                    }
                }


                // ========================================
                // 2. NBA TENURE
                // ========================================

                const tenureScore =
                    gamesPlayed > 0
                        ? Math.min(
                            1,
                            Math.log10(gamesPlayed + 1) /
                            Math.log10(1001)
                        )
                        : 0;

                const tenureReduction =
                    100 * tenureScore;

                points -= tenureReduction;


                // ========================================
                // 3. RECENT PRODUCTION
                // ========================================

                const ppgScore =
                    Math.min(1, ppg / 30);

                const apgScore =
                    Math.min(1, apg / 10);

                const rpgScore =
                    Math.min(1, rpg / 15);

                const mpgScore =
                    Math.min(1, mpg / 36);

                const recentScore =
                    0.50 * ppgScore +
                    0.20 * apgScore +
                    0.15 * rpgScore +
                    0.15 * mpgScore;

                const recentReduction =
                    650 * recentScore;

                points -= recentReduction;


                // ========================================
                // 4. CAREER PRODUCTION
                // ========================================

                const careerPointsScore =
                    Math.min(
                        1,
                        Math.sqrt(careerTotalPoints / 20000)
                    );

                const careerAssistsScore =
                    Math.min(
                        1,
                        Math.sqrt(careerTotalAssists / 7000)
                    );

                const careerReboundsScore =
                    Math.min(
                        1,
                        Math.sqrt(careerTotalRebounds / 10000)
                    );

                const careerScore =
                    0.50 * careerPointsScore +
                    0.25 * careerAssistsScore +
                    0.25 * careerReboundsScore;

                const careerReduction =
                    150 * careerScore;

                points -= careerReduction;


                // ========================================
                // 5. FINAL
                // ========================================

                const gamePoints = Math.round(
                    Math.min(1000, Math.max(100, points))
                );

                player.points = gamePoints;

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
        JSON.stringify(players, null, 1)
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

