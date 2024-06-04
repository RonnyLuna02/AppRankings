const express = require('express');
const { saveAllLogs, readLogsThaemine, readLogsVoldis, readLogsAkkan, updateItem, deleteItem } = require('./crud');
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
                            let resultado;
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            if (dmg != 100) {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && ((log.nameBoss === 'Evolved Maurug') || (log.nameBoss === 'Griefbringer Maurug')) && tryPlayersCount(log)
                                        && (log.totalDmgDealt > totalDmgDealt(dmg, raid, id, raidDifficulty))
                                });
                            } else {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && ((log.nameBoss === 'Evolved Maurug') || (log.nameBoss === 'Griefbringer Maurug')) && tryPlayersCount(log)
                                        && (log.cleared > 0)
                                });
                            }
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
                            let resultado;
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            if (dmg != 100) {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && (log.nameBoss === 'Lord of Degradation Akkan') && tryPlayersCount(log)
                                        && (log.totalDmgDealt > totalDmgDealt(dmg, raid, id, raidDifficulty))
                                });
                            } else {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && (log.nameBoss === 'Lord of Degradation Akkan') && tryPlayersCount(log)
                                        && (log.cleared > 0)
                                });
                            }
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
                            let resultado;
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            if (dmg != 100) {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && ((log.nameBoss === 'Plague Legion Commander Akkan') || (log.nameBoss === 'Lord of Kartheon Akkan')) && tryPlayersCount(log)
                                        && (log.totalDmgDealt > totalDmgDealt(dmg, raid, id, raidDifficulty))
                                });
                            } else {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && ((log.nameBoss === 'Plague Legion Commander Akkan') || (log.nameBoss === 'Lord of Kartheon Akkan')) && tryPlayersCount(log)
                                        && (log.cleared > 0)
                                });
                            }
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
                            let resultado;
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            if (dmg != 100) {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && (log.nameBoss === 'Killineza the Dark Worshipper') && tryPlayersCount(log)
                                        && (log.totalDmgDealt > totalDmgDealt(dmg, raid, id, raidDifficulty))
                                });
                            } else {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && (log.nameBoss === 'Killineza the Dark Worshipper') && tryPlayersCount(log)
                                        && (log.cleared > 0)
                                });
                            }
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
                            let resultado;
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            if (dmg != 100) {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && ((log.nameBoss === 'Valinak, Knight of Darkness') || (log.nameBoss === 'Valinak, Taboo Usurper')
                                        || (log.nameBoss === 'Valinak, Herald of the End')) && tryPlayersCount(log)
                                        && (log.totalDmgDealt > totalDmgDealt(dmg, raid, id, raidDifficulty))
                                });
                            } else {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && ((log.nameBoss === 'Valinak, Knight of Darkness') || (log.nameBoss === 'Valinak, Taboo Usurper')
                                        || (log.nameBoss === 'Valinak, Herald of the End')) && tryPlayersCount(log)
                                        && (log.cleared > 0)
                                });
                            }
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
                            let resultado;
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            if (dmg != 100) {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && ((log.nameBoss === 'Thaemine the Lightqueller') || (log.nameBoss === 'Dark Greatsword')) && tryPlayersCount(log)
                                        && (log.totalDmgDealt > totalDmgDealt(dmg, raid, id, raidDifficulty))
                                });
                            } else {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && ((log.nameBoss === 'Thaemine the Lightqueller') || (log.nameBoss === 'Dark Greatsword')) && tryPlayersCount(log)
                                        && (log.cleared > 0)
                                });
                            }
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
    } else if (raid === 'voldis') {
        readLogsVoldis(raidDifficulty, (err, rows) => {
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
                            let resultado;
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            if (dmg != 100) {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && (log.nameBoss === 'Kaltaya, the Blooming Chaos') && tryPlayersCount(log)
                                        && (log.totalDmgDealt > totalDmgDealt(dmg, raid, id, raidDifficulty))
                                });
                            } else {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && (log.nameBoss === 'Kaltaya, the Blooming Chaos') && tryPlayersCount(log)
                                        && (log.cleared > 0)
                                });
                            }
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
                            let resultado;
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            if (dmg != 100) {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && (log.nameBoss === 'Rakathus, the Lurking Arrogance') && tryPlayersCount(log)
                                        && (log.totalDmgDealt > totalDmgDealt(dmg, raid, id, raidDifficulty))
                                });
                            } else {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && (log.nameBoss === 'Rakathus, the Lurking Arrogance') && tryPlayersCount(log)
                                        && (log.cleared > 0)
                                });
                            }
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
                            let resultado;
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            if (dmg != 100) {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && (log.nameBoss === 'Firehorn, Trampler of Earth') && tryPlayersCount(log)
                                        && (log.totalDmgDealt > totalDmgDealt(dmg, raid, id, raidDifficulty))
                                });
                            } else {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && (log.nameBoss === 'Firehorn, Trampler of Earth') && tryPlayersCount(log)
                                        && (log.cleared > 0)
                                });
                            }
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
                    case '4':
                        names.forEach(element => {
                            player = {};
                            let resultado;
                            const arrUniq = [...new Map(rows.map(v => [JSON.stringify([v.totalDmgTaken, v.name]), v])).values()]
                            if (dmg != 100) {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && (log.nameBoss === 'Lazaram, the Trailblazer') && tryPlayersCount(log)
                                        && (log.totalDmgDealt > totalDmgDealt(dmg, raid, id, raidDifficulty))
                                });
                            } else {
                                resultado = arrUniq.filter(function (log) {
                                    return (log.name === element) && (log.nameBoss === 'Lazaram, the Trailblazer') && tryPlayersCount(log)
                                        && (log.cleared > 0)
                                });
                            }
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
                        break;
                }
            }
        })
    }
});

app.post('/logs', upload.single('logs'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file included')
    }
    saveAllLogs(req.file)
    res.send('DB ingresada')
});

app.listen(3000, () => {
    console.log("Server is Running")
});

function tryPlayersCount(obj) {

    if (Object.hasOwn(obj, 'tryPlayers')) {
        let objeto = JSON.parse(obj.tryPlayers)
        var vals = Object.keys(objeto).map(function (key) {
            return objeto[key];
        });
        const merge3 = vals.flat(1);
        return (merge3.length === 4) || (merge3.length === 8)
    } else {
        return false;
    }
};

function totalDmgDealt(percent, raid, gate, difficulty) {
    let gates;
    switch (raid) {
        case 'akkan':
            gates = {
                Hard: {
                    '1': 29596865148,
                    '2': 25832140459,
                    '3': 56116859405
                },
                Normal: {
                    '1': 18826758086,
                    '2': 20747449536,
                    '3': 23328379532
                }
            }
            if (percent === 0) {
                return 0;
            } else {
                return (Math.trunc((gates[difficulty][gate] * percent) / 100))
            }
            break;
        case 'voldis':
            gates = {
                Hard: {
                    '1': 18114884391,
                    '2': 35946915710,
                    '3': 26914105076,
                    '4': 29612034158
                },
                Normal: {
                    '1': 9304860934,
                    '2': 18869882474,
                    '3': 13816842478,
                    '4': 15165030149
                }
            }
            if (percent === 0) {
                return 0;
            } else {
                return (Math.trunc((gates[difficulty][gate] * percent) / 100))
            }
            break;

        case 'thaemine':
            gates = {
                Hard: {
                    '1': 0,
                    '2': 0,
                    '3': 0,
                    '4': 0
                },
                Normal: {
                    '1': 30674780897,
                    '2': 37851661157,
                    '3': 63583172546
                }
            }
            if (percent === 0) {
                return 0;
            } else {
                return (Math.trunc((gates[difficulty][gate] * percent) / 100))
            }
            break;
        default:
            break;
    }
}

function removeDuplicates(arr) {
    let unique = [];
    arr.forEach(element => {
        if (!unique.includes(element.name) && (element.entityType === 'PLAYER')) {
            unique.push(element.name);
        }
    });
    return unique;
}
