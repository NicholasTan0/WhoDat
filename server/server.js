require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
// const fs = require('fs');

const app = express();
app.use(cors());

const teams = [ 
    'atl', 'bos', 'bkn', 'cha', 'chi', 'cle', 'dal', 'den', 'det', 'gs',
    'hou', 'ind', 'lac', 'lal', 'mem', 'mia', 'mil', 'min', 'no', 'ny',
    'okc', 'orl', 'phi', 'phx', 'por', 'sac', 'sa', 'tor', 'utah', 'wsh'
];

const players = [];

const getPlayers = async () => {
    console.time("Retrieved all players");
    const requests = teams.map(async (team) => {
        const teamURL = `https://www.espn.com/nba/team/roster/_/name/${team}`;
        try {
            const response = await axios.get(teamURL);
            const $ = cheerio.load(response.data);

            $('table').eq(0).find('tbody tr').each((index, row) => {
                const tds = $(row).find('td');
                const nameLink = tds.eq(1).find('div');
                const name = nameLink.find('a').text();
                const number = nameLink.find('span').text();
                const link = nameLink.find('a').attr('href'); 
                const id = link.replace(/\D/g, '');
                //`https://www.espn.com/nba/player/_/id/${id}/${name.replace(/\s/g, '-')}`
                const position = tds.eq(2).find('div').text();
                const age = tds.eq(3).find('div').text();
                const height = tds.eq(4).find('div').text();
                const college = tds.eq(6).find('div').text();
                players.push({name, number, position, age, height, college, team, id});
            });
        } catch (error) {
            console.error(`Failed at ${team}:`, error.message);
        }
    });
    await Promise.all(requests);
    console.timeEnd("Retrieved all players");
}

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
app.listen(PORT, ()=> console.log(`Ears open on ${PORT}...`));

