const { CLIENT_RENEG_WINDOW } = require('node:tls');
const appDb = require('./database');
const fs = require('node:fs');
const { ifError } = require('node:assert');
const sqlite3 = require('sqlite3').verbose();

let encounterDb;

const saveAllLogs = (file) => {

    let dataEncounters = [];
    let mainList = [];
    var hasNumber = /\d/;
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
                        if (error) {
                            console.log(error)
                        } else {
                            //console.log('Log ' + element.id + ' ingresado')
                        }
                    });
                }
            });
            encounterDb.close((error) => {
                if (error) {
                    console.log(error)
                } else {
                    fs.renameSync(uploadedDb, `./logs/${playerMain(mainList)}-` + Date.now() + '.db', (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('encounters.db cambiado')
                        }
                    })
                }
            });

            console.log('id: ' + rows[156].id)
            console.log('name: ' + rows[156].name)
            console.log('last_combat_packet: ' + rows[156].last_combat_packet)
            console.log('fight_start: ' + rows[156].fight_start)
            console.log('local_player: ' + rows[156].local_player)
            console.log('current_boss: ' + rows[156].current_boss)
            console.log('duration: ' + rows[156].duration)
            console.log('total_damage_dealt: ' + rows[156].total_damage_dealt)
            console.log('top_damage_dealt: ' + rows[156].top_damage_dealt)
            console.log('total_damage_taken: ' + rows[156].total_damage_taken)
            console.log('top_damage_taken: ' + rows[156].top_damage_taken)
            console.log('tryTotalDps: ' + rows[156].tryTotalDps)
            console.log('difficulty: ' + rows[156].difficulty)
            console.log('cleared: ' + rows[156].cleared)
            console.log('region: ' + JSON.parse(rows[156].misc).region)
            console.log('encounter_id: ' + rows[156].encounter_id)
            console.log('entity_type: ' + rows[156].entity_type)
            console.log('npc_id: ' + rows[156].npc_id)
            console.log('class: ' + rows[156].class)
            console.log('gear_score: ' + Math.floor(rows[156].gear_score))
            console.log('current_hp: ' + rows[156].current_hp)
            console.log('max_hp: ' + rows[156].max_hp)
            console.log('is_dead: ' + rows[156].is_dead)
            console.log('damageDealt: ' + JSON.parse(rows[156].damage_stats).damageDealt)
            console.log('damageTaken: ' + JSON.parse(rows[156].damage_stats).damageTaken)
            console.log('critDamage: ' + JSON.parse(rows[156].damage_stats).critDamage)
            console.log('backAttackDamage: ' + JSON.parse(rows[156].damage_stats).backAttackDamage)
            console.log('frontAttackDamage: ' + JSON.parse(rows[156].damage_stats).frontAttackDamage)
            console.log('deaths: ' + JSON.parse(rows[156].damage_stats).deaths)
            console.log('counters: ' + JSON.parse(rows[156].skill_stats).counters)
            console.log('deathTime: ' + JSON.parse(rows[156].damage_stats).deathTime)
            console.log('parties: ' + JSON.stringify(JSON.parse(rows[156].misc).partyInfo))
            console.log('player id: ' + rows[156].character_id)
        }
    });
};

const saveLog = (element, callback) => {

    const sql = `INSERT INTO log ( name, tryId, entityType, npcId, currentHp, maxHp, class, gearLvl, dps, entityDmgDealt, dead, deathTime, counter, backAttack, frontAttack, critDmg, dmgTaken, buffUpTime, buffIdentity, fightEndTime, fightStartTime, localPlayer, nameBoss, duration, totalDmgDealt, topDmgDealt, totalDmgTaken, topDmgTaken, tryTotalDps, difficulty, cleared, region, tryPlayers, engravings, playerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    appDb.run(sql, [element.name, element.id, element.entity_type, element.npc_id, element.current_hp, element.max_hp, element.class,
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
    const sql = `SELECT encounter.id, encounter.last_combat_packet, encounter.fight_start, encounter.local_player,
    encounter.current_boss, encounter.duration, encounter.total_damage_dealt, encounter.top_damage_dealt,
    encounter.total_damage_taken, encounter.top_damage_taken, encounter.dps AS tryTotalDps, encounter.difficulty,
    encounter.cleared, encounter.misc, entity.*
    FROM encounter
    LEFT JOIN entity ON encounter.id = entity.encounter_id
    WHERE encounter.difficulty = 'Normal' OR encounter.difficulty = 'Hard';
    ORDER BY encounter.id;`;
    db.all(sql, [], callback)
};

const readLogsThaemine = (difficulty, callback) => {
    const sql = `SELECT * FROM log WHERE localPlayer GLOB '*[^0-9]*' AND difficulty = '${difficulty}' AND (nameBoss = 'Killineza the Dark Worshipper' OR nameBoss = 'Valinak, Herald of the End' OR nameBoss = 'Valinak, Taboo Usurper' OR nameBoss = 'Valinak, Herald of the End' OR nameBoss = 'Thaemine the Lightqueller' OR nameBoss = 'Dark Greatsword')`;
    appDb.all(sql, [], callback)
};

const readLogsAkkan = (difficulty, callback) => {
    const sql = `SELECT * FROM log WHERE localPlayer GLOB '*[^0-9]*' AND gearLvl > 0 AND difficulty = '${difficulty}' AND (nameBoss = 'Lord of Degradation Akkan' OR nameBoss = 'Evolved Maurug' OR nameBoss = 'Griefbringer Maurug' OR nameBoss = 'Plague Legion Commander Akkan' OR nameBoss = 'Lord of Kartheon Akkan')`;
    appDb.all(sql, [], callback)
};

const updateItem = (id, name, description, callback) => {
    const sql = `UPDATE items SET name = ?, description = ? WHERE id = ?`
    appDb.run(sql, [name, description, id], callback)
};

const deleteItem = (id, callback) => {
    const sql = `DELETE FROM items WHERE id = ?`
    appDb.run(sql, id, callback)
};

module.exports = { saveAllLogs, readLogsThaemine, readLogsAkkan, updateItem, deleteItem };