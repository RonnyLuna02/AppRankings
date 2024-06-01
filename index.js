const express = require('express');
const { saveAllLogs, readLogsThaemineNormal, updateItem, deleteItem } = require('./crud');
const multer = require('multer');
const fs = require('node:fs');
const dbEncounter = require('./database');
const { type } = require('node:os');
const cors = require('cors');

const upload = multer({ dest: 'logs/' });
const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
});

app.get('/Thaeminen', (req, res) => {
    readLogsThaemineNormal((err, rows) => {
        if (err) {
            res.status(500).send(err.message)
        } else {
            let names = removeDuplicates(rows);
            //console.log(names)
            let players = [];
            let player = {};
            let allPlayers = [];
            let nume = 0;
            //console.log(removeDuplicates(rows));
            names.forEach(element => {
                player = {};
                const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                let resultado = arrUniq.filter(function (log) { return (log.name === element) && ((log.nameBoss === 'Thaemine the Lightqueller') || (log.nameBoss === 'Dark Greatsword')) && (log.totalDmgDealt > 14047443219) });
                if (Object.keys(resultado).length > 0) {
                    player.name = resultado[0].name;
                    player.class = resultado[0].class;
                    player.itemLvl = Math.max(...resultado.map(a => a.gearLvl));
                    const dpsLogs = resultado.map(a => a.dps);
                    const clearsLogs = resultado.map(a => a.cleared);
                    player.maxDps = Math.max(...resultado.map(a => a.dps));
                    player.minDps = Math.min(...resultado.map(a => a.dps));
                    player.averageDps = Math.trunc(dpsLogs.reduce((a, b) => a + b) / Object.keys(dpsLogs).length);
                    player.tries = Object.keys(dpsLogs).length;
                    player.clears = resultado.reduce((a, b) => a + b.cleared, 0);
                    players.push(player)
                }
            });
            res.status(200).json(players);
        }
    })
});

app.post('/logs', upload.single('logs'), (req, res) => {
    saveAllLogs(req.file)
    res.send('DB ingresada')
});

app.put('/items/:id', (req, res) => {
    const { name, description } = req.body;
    updateItem(req.params.id, name, description, (err) => {
        if (err) {
            res.status(500).send(err.message)
        } else {
            res.status(200).send("Updated item")
        }
    })
});

app.delete('/items/:id', (req, res) => {
    deleteItem(req.params.id, (err) => {
        if (err) {
            res.status(500).send(err.message)
        } else {
            res.status(200).send("Deleted item")
        }
    })
});

app.listen(3000, () => {
    console.log("Server is Running")
});

function removeDuplicates(arr) {
    let unique = [];
    arr.forEach(element => {
        if (!unique.includes(element.name) && (element.entityType === 'PLAYER') && ((element.nameBoss === 'Thaemine the Lightqueller') || (element.nameBoss === 'Dark Greatsword'))) {
            unique.push(element.name);
        }
    });
    return unique;
}
