const sqlite3 = require('sqlite3').verbose();
const mainDb = 'appRanking.db';

let appDb = new sqlite3.Database(mainDb, (err) => {
    if (err) {
        console.error(err.message)
    } else {
        console.log("Connected to the Main Database")
        appDb.run(`CREATE TABLE IF NOT EXISTS log (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, tryId INTEGER, 
            entityType TEXT, npcId INTEGER, currentHp INTEGER, maxHp INTEGER, class TEXT, gearLvl INTEGER, 
            dps INTEGER, entityDmgDealt INTEGER, dead INTEGER, deathTime INTEGER, counter INTEGER, backAttack INTEGER, 
            frontAttack INTEGER, critDmg INTEGER, dmgTaken INTEGER, buffUpTime INTEGER, buffIdentity INTEGER,
             fightEndTime INTEGER, fightStartTime INTEGER, localPlayer TEXT, nameBoss TEXT, duration INTEGER, 
             totalDmgDealt INTEGER, topDmgDealt INTEGER, totalDmgTaken INTEGER, topDmgTaken INTEGER, tryTotalDps INTEGER,
              difficulty TEXT, cleared INTEGER, region TEXT, tryPlayers TEXT, engravings TEXT, playerId INTEGER,  CONSTRAINT unq UNIQUE (name, localPlayer, tryId, totalDmgTaken) ON CONFLICT IGNORE)`, (err) => {
            if (err) {
                console.error(err.message)
            } else {
                console.log('Log table created or existed')
            }
        });
        // appDb.run('CREATE TABLE IF NOT EXISTS encounter (id INTEGER PRIMARY KEY AUTOINCREMENT, fightEndTime INTEGER, fightStartTime INTEGER, localPlayer TEXT, nameBoss TEXT, duration INTEGER, totalDmgDealt INTEGER, topDmgDealt INTEGER, totalDmgTaken INTEGER, topDmgTaken INTEGER, dps INTEGER, difficulty TEXT, cleared INTEGER, tryPlayers TEXT)', (err) => {
        //     if (err) {
        //         console.error(err.message)
        //     } else {
        //         console.log('Encounter table created or existed')
        //     }
        // });
    }
})

module.exports = appDb;