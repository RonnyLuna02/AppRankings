const express = require('express');
const { saveAllLogs, readLogsThaemine, readLogsAkkan, updateItem, deleteItem } = require('./crud');
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

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
});

app.get('/:raid/:difficulty/:id/:dmg', (req, res) => {
    const id = req.params.id;
    const raidDifficulty = req.params.difficulty;
    const raid = req.params.raid;
    const dmg = req.params.dmg;
    if (raid === 'akkan') {
        readLogsAkkan(raidDifficulty, (err, rows) => {
            if (err) {
                res.status(500).send(err.message)
            } else {
                let names = removeDuplicates(rows);
                let players = [];
                let player = {};

                switch (id) {
                    case '1':
                        names.forEach(element => {
                            player = {};
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            let resultado = arrUniq.filter(function (log) { return (log.name === element) && ((log.nameBoss === 'Evolved Maurug') || (log.nameBoss === 'Griefbringer Maurug')) && (log.totalDmgDealt > 3514318700) });
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
                        break;
                    case '2':
                        names.forEach(element => {
                            player = {};
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            let resultado = arrUniq.filter(function (log) {
                                return (log.name === element) && (log.nameBoss === 'Lord of Degradation Akkan')/* && (log.totalDmgDealt > 8757955749)*/
                            });
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
                        break;
                    case '3':
                        names.forEach(element => {
                            player = {};
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            let resultado = arrUniq.filter(function (log) {
                                return (log.name === element) && ((log.nameBoss === 'Plague Legion Commander Akkan') || (log.nameBoss === 'Lord of Kartheon Akkan'))
                                /*&& (log.totalDmgDealt > 14047443219) && (log.gearLvl < 1620)*/
                            });
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
                        break;
                    default:
                        res.status(200).json(players);
                        break;
                }
            }
        })
    } else if (raid === 'thaemine') {
        readLogsThaemine(raidDifficulty, (err, rows) => {
            if (err) {
                res.status(500).send(err.message)
            } else {
                let names = removeDuplicates(rows);
                let players = [];
                let player = {};

                switch (id) {
                    case '1':
                        names.forEach(element => {
                            player = {};
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            let resultado = arrUniq.filter(function (log) { return (log.name === element) && (log.nameBoss === 'Killineza the Dark Worshipper') && (log.totalDmgDealt > 6992238864) });
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
                        break;
                    case '2':
                        names.forEach(element => {
                            player = {};
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            let resultado = arrUniq.filter(function (log) {
                                return (log.name === element) && ((log.nameBoss === 'Valinak, Knight of Darkness') || (log.nameBoss === 'Valinak, Taboo Usurper')
                                    || (log.nameBoss === 'Valinak, Herald of the End')) && (log.totalDmgDealt > 8757955749)
                            });
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
                        break;
                    case '3':
                        names.forEach(element => {
                            player = {};
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            let resultado = arrUniq.filter(function (log) {
                                return (log.name === element) && ((log.nameBoss === 'Thaemine the Lightqueller') || (log.nameBoss === 'Dark Greatsword'))
                                /*&& (log.totalDmgDealt > 14047443219) && (log.gearLvl < 1620)*/
                            });
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
                        break;
                    default:
                        res.status(200).json(players);
                        break;
                }
            }
        })
    }

});

<<<<<<< HEAD
app.get('/code.js', (req, res) => {
    res.sendFile(__dirname + '/js/code.js')
})
app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/static/style.css')
})

app.get('/bg-beatrice.jpg', (req, res) => {
    res.sendFile(__dirname + '/bg-beatrice.jpg')
})

app.get('/thaemine.jpg', (req, res) => {
    res.sendFile(__dirname + '/thaemine.jpg')
})

app.get('/voldis.png', (req, res) => {
    res.sendFile(__dirname + '/voldis.png')
})

app.get('/akkan.jpg', (req, res) => {
    res.sendFile(__dirname + '/akkan.jpg')
})

=======
>>>>>>> 294664d (public structure)
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
        if (!unique.includes(element.name) && (element.entityType === 'PLAYER')) {
            unique.push(element.name);
        }
    });
    return unique;
}
