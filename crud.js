const { CLIENT_RENEG_WINDOW } = require('node:tls');
const appDb = require('./database');
const fs = require('node:fs');
const { ifError } = require('node:assert');
const sqlite3 = require('sqlite3').verbose();

let encounterDb;

const saveAllLogs = (file) => {

    let mainList = [];
    encounterDb = {};
    let uploadedDb = `${renameFile(file)}`;
    encounterDb = new sqlite3.Database(uploadedDb, (err) => {
        if (err) {
            console.error(err.message)
        } else {
            console.log("Connected to encounters.db")
        }
    });

    readEncounters(encounterDb, (err, rows) => {
        if (err) {
            console.log(err.message)
        } else {
            rows.forEach(element => {
                mainList.push(element.local_player);
                if ((element.fight_start === 0) || (element.last_combat_packet === 0)) {
                    console.log('Id log bug: ' + element.id)
                } else {
                    saveLog(element, (error) => {
                        // console.log('element ' + element.old_id + ' id try ' + element.old_id)
                        if (error) {
                            console.log(element.old_id)
                        } else {
                            // console.log('Log ' + element.old_id + ' ingresado')
                        }
                    });
                }
            });
            encounterDb.close((error) => {
                if (error) {
                    console.log(error)
                } else {
                    fs.renameSync(uploadedDb, `./data/logs/${playerMain(mainList)}-` + Date.now() + '.db', (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('encounters.db cambiado')
                        }
                    })
                }
            });
        }
    });
};

const saveLog = (element, callback) => {

    const sql = `INSERT INTO log ( name, tryId, entityType, npcId, currentHp, maxHp, class, gearLvl, dps, entityDmgDealt, dead, deathTime, counter, backAttack, frontAttack, critDmg, dmgTaken, buffUpTime, buffIdentity, fightEndTime, fightStartTime, localPlayer, nameBoss, duration, totalDmgDealt, topDmgDealt, totalDmgTaken, topDmgTaken, tryTotalDps, difficulty, cleared, region, tryPlayers, engravings, playerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    appDb.run(sql, [element.name, element.old_id, element.entity_type, element.npc_id, element.current_hp, element.max_hp, element.class,
    Math.floor(element.gear_score), element.dps, JSON.parse(element.damage_stats).damageDealt, element.is_dead,
    JSON.parse(element.damage_stats).deathTime, JSON.parse(element.skill_stats).counters, JSON.parse(element.damage_stats).backAttackDamage,
    JSON.parse(element.damage_stats).frontAttackDamage, JSON.parse(element.damage_stats).critDamage, JSON.parse(element.damage_stats).damageTaken, 0, 0,
    element.last_combat_packet, element.fight_start, element.local_player, element.current_boss, element.duration, element.total_damage_dealt, element.top_damage_dealt,
    element.total_damage_taken, element.top_damage_taken, element.tryTotalDps, element.difficulty, element.cleared, JSON.parse(element.misc).region,
    JSON.stringify(JSON.parse(element.misc).partyInfo), element.engravings, element.character_id], callback)
};

function renameFile(dbFile) {

    const newPath = `${dbFile.path}.db`
    fs.renameSync(dbFile.path, newPath);
    return newPath;
}

function playerMain(nombres) {
    let element = nombres.reduce((accVal, val) => ((accVal[val] = (accVal[val] || 0) + 1), accVal), {});
    var mainName;
    let max = 0;
    for (let val in element) {
        if (max < element[val]) {
            max = element[val];
            mainName = val;
        }
    }
    return mainName;
};

const readEncounters = (db, callback) => {
    const sql = `SELECT encounter.old_id, encounter.last_combat_packet, encounter.fight_start, encounter.local_player,
    encounter.current_boss, encounter.duration, encounter.total_damage_dealt, encounter.top_damage_dealt,
    encounter.total_damage_taken, encounter.top_damage_taken, encounter.dps AS tryTotalDps, encounter.difficulty,
    encounter.cleared, encounter.misc, entity.*
    FROM encounter
    LEFT JOIN entity ON encounter.old_id = entity.encounter_id
    WHERE encounter.difficulty = 'Normal' OR encounter.difficulty = 'Hard';
    ORDER BY encounter.old_id;`;
    db.all(sql, [], callback)
};

const readLogsThaemine = (difficulty, callback) => {
    const sql = `SELECT name, class, gearLvl, dps, entityDmgDealt, nameBoss, totalDmgDealt, totalDmgTaken, cleared, tryPlayers FROM log WHERE name GLOB '*[^1-9]*' AND localPlayer GLOB '*[^1-9]*' AND difficulty = '${difficulty}' AND entityType = 'PLAYER' AND class != 'Bard' AND class != 'Paladin' AND class != 'Artist' AND (nameBoss = 'Killineza the Dark Worshipper' OR nameBoss = 'Valinak, Herald of the End' OR nameBoss = 'Valinak, Taboo Usurper' OR nameBoss = 'Valinak, Herald of the End' OR nameBoss = 'Thaemine the Lightqueller' OR nameBoss = 'Dark Greatsword')`;
    appDb.all(sql, [], callback)
};

const readLogsVoldis = (difficulty, callback) => {
    const sql = `SELECT name, class, gearLvl, dps, entityDmgDealt, nameBoss, totalDmgDealt, totalDmgTaken, cleared, tryPlayers FROM log WHERE name GLOB '*[^1-9]*' AND localPlayer GLOB '*[^1-9]*' AND difficulty = '${difficulty}' AND entityType = 'PLAYER' AND class != 'Bard' AND class != 'Paladin' AND class != 'Artist' AND (nameBoss = 'Kaltaya, the Blooming Chaos' OR nameBoss = 'Rakathus, the Lurking Arrogance' OR nameBoss = 'Firehorn, Trampler of Earth' OR nameBoss = 'Lazaram, the Trailblazer')`;
    appDb.all(sql, [], callback)
};

const readLogsAkkan = (difficulty, callback) => {
    const sql = `SELECT name, class, gearLvl, dps, entityDmgDealt, nameBoss, totalDmgDealt, totalDmgTaken, cleared, tryPlayers FROM log WHERE name GLOB '*[^1-9]*' AND localPlayer GLOB '*[^1-9]*' AND difficulty = '${difficulty}' AND entityType = 'PLAYER' AND class != 'Bard' AND class != 'Paladin' AND class != 'Artist' AND (nameBoss = 'Lord of Degradation Akkan' OR nameBoss = 'Evolved Maurug' OR nameBoss = 'Griefbringer Maurug' OR nameBoss = 'Plague Legion Commander Akkan' OR nameBoss = 'Lord of Kartheon Akkan')`;
    appDb.all(sql, [], callback)
};

const readMinDps = (difficulty, callback) => {
    const sql = `SELECT name, class, gearLvl, tryId, dead, deathTime, counter, backAttack, frontAttack, critDmg, dmgTaken, fightEndTime, fightStartTime, duration, tryTotalDps, dps, entityDmgDealt, nameBoss, totalDmgDealt, totalDmgTaken, cleared, tryPlayers FROM log WHERE name GLOB '*[^1-9]*' AND localPlayer GLOB '*[^1-9]*' AND difficulty = '${difficulty}' AND entityType = 'PLAYER' AND class != 'Bard' AND class != 'Paladin' AND class != 'Artist'`;
    appDb.all(sql, [], callback)
};

const readMaxDps = (difficulty, callback) => {
    const sql = `SELECT name, class, gearLvl, tryId, dead, deathTime, counter, backAttack, frontAttack, critDmg, dmgTaken, fightEndTime, fightStartTime, duration, tryTotalDps, dps, entityDmgDealt, nameBoss, totalDmgDealt, totalDmgTaken, cleared, tryPlayers FROM log WHERE name GLOB '*[^1-9]*' AND localPlayer GLOB '*[^1-9]*' AND difficulty = '${difficulty}' AND entityType = 'PLAYER' AND class != 'Bard' AND class != 'Paladin' AND class != 'Artist'`;
    appDb.all(sql, [], callback)
};

module.exports = { saveAllLogs, readLogsThaemine, readLogsVoldis, readLogsAkkan, readMaxDps, readMinDps };