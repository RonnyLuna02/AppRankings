const url = '/'
const contenedor = document.querySelector('tbody');
let searchInput = document.getElementById('search');
let searchClass = document.getElementById('searchClass');
let iLvlInput = document.getElementById('searchItemLvl');
let btns = document.querySelectorAll('input');
let blockBtns = document.querySelectorAll('btn');
let logTable = document.getElementById('logTable');
var rows;
let resultados = '';
const form = document.getElementById('fileForm');

form.addEventListener('submit', (event) => {
    document.getElementById('btnSubmit').hidden = true;
    fetch('/api', {
        method: 'POST',
        body: new FormData(form),
    }).then((response) => {
        if (response.status === 200) {
            alert("Uploaded");
        } else {
            alert("Error");
        }
    })
    event.preventDefault();
});

function maxDps(playerName) {
    let tryMaxDps = playerName.id;
    let maxDpsName = playerName.parentElement.id;
    let raid = document.querySelector("input[name=btnRaid]:checked").value
    let raidDifficulty = document.querySelector("input[name=btnDifficulty]:checked").value
    let gate = document.querySelector("input[name=btnGate]:checked").value
    let gateProgress = document.querySelector("input[name=btnDmgDealt]:checked").value

    fetch(url + 'maxdps/' + raid + '/' + difficulty + '/' + id + '/' + gateProgress + '/' + maxDpsName + '/' + tryMaxDps)
        .then(response => response.json())
        .then(data => mostrarTry(data, maxDpsName))
        .catch(error => console.log(error));
}

function minDps(playerName) {
    let tryMinDps = playerName.id;
    let minDpsName = playerName.parentElement.id;
    let raid = document.querySelector("input[name=btnRaid]:checked").value
    let raidDifficulty = document.querySelector("input[name=btnDifficulty]:checked").value
    let gate = document.querySelector("input[name=btnGate]:checked").value
    let gateProgress = document.querySelector("input[name=btnDmgDealt]:checked").value

    fetch(url + 'mindps/' + raid + '/' + difficulty + '/' + id + '/' + gateProgress + '/' + minDpsName + '/' + tryMinDps)
        .then(response => response.json())
        .then(data => mostrarTry(data, minDpsName))
        .catch(error => console.log(error));

}

function showImg() {
    document.getElementById('imgFolder').style.backgroundImage = 'url(/folder.png)'
    document.getElementById('imgFolder').style.backgroundSize = 'contain'
    document.getElementById('imgFolder').style.backgroundRepeat = 'no-repeat'
}

function hideImg() {
    document.getElementById('imgFolder').style.backgroundImage = ''
}

searchInput.addEventListener('keyup', function (event) {
    const q = event.target.value.toLowerCase();
    rows.forEach((row) => {
        row.querySelector('#name').textContent.toLowerCase().startsWith(q) ? (row.style.display = 'table-row') : (row.style.display = 'none')
    });
});

searchClass.addEventListener('keyup', function (event) {
    const q = event.target.value.toLowerCase();
    rows.forEach((row) => {
        row.querySelector('#class').textContent.toLowerCase().startsWith(q) ? (row.style.display = 'table-row') : (row.style.display = 'none')
    });
});

iLvlInput.addEventListener('keyup', function (event) {
    const q = event.target.value;
    if (q.length === 4) {
        rows.forEach((row) => {
            if (row.querySelector('#itemLvl').textContent > q) {
                row.style.display = 'none'
            } else {
                row.style.display = 'table-row'
            }
        });
    } else {
        rows.forEach((row) => {
            row.style.display = 'table-row'
        });
    }
});

const mostrarTry = (rows, name) => {
    resultados = '';
    let logBody = document.getElementById('logBody');
    let clear = rows[0];
    let tryPlayers = [];
    rows[1].forEach(e => {
        tryPlayers.push(e);
    })
    var arrays = document.querySelectorAll('tbody tr')
    arrays.forEach(tr => tr.id != name ? (tr.style.display = 'none') : (tr.display = 'table-row'))
    logTable.hidden = false;
    tryPlayers.sort((a, b) => b.entityDmgDealt - a.entityDmgDealt);
    debugger
    tryPlayers.forEach(player => {
        resultados += `<tr id="${player.name}">
                    <td><img src="/icons/${player.class}.png" class="img-fluid " style="width: 30px;" alt="${player.class}"></td>
                    <td>${player.gearLvl}</td>
                    <td id="name" ><a href="#" style='color: white'>${player.name}</a></td>
                    <td>100s</td>
                    <td>${formatBill(player.entityDmgDealt)} b</td>
                    <td>${formatMill(player.dps)} m</td>
                    <td>${((100 * player.entityDmgDealt) / player.totalDmgDealt).toFixed(1)}%</td>                    
                    <td>${((100 * player.frontAttack) / player.entityDmgDealt).toFixed(1)}%</td>
                    <td>${((100 * player.backAttack) / player.entityDmgDealt).toFixed(1)}%</td>
                    <td>${player.counter}</td>
                </tr>
                `
    })
    logBody.innerHTML = resultados;
    debugger
}

const mostrar = (players) => {
    let id = 0;
    logTable.hidden = true;
    players.sort((a, b) => b.maxDps - a.maxDps);
    players.forEach(player => {
        id++
        resultados += `<tr id="${player.name}">
                    <td>${id}</td>
                    <td id="name" ><a href="#" style='color: white'>${player.name}</a></td>
                    <td id="class">${player.class}</td>
                    <td id="itemLvl">${player.itemLvl}</td>
                    <td id="${player.maxDps}"><a href="#" style='color: white' onclick="maxDps(this.parentElement)">${formatMill(player.maxDps)} m</a></td>
                    <td id="${player.minDps}"><a href="#" style='color: white' onclick="minDps(this.parentElement)">${formatMill(player.minDps)} m</a></td>
                    <td>${formatMill(player.averageDps)} m</td>
                    <td>${player.tries}</td>
                    <td>${player.clears}</td>
                </tr>
                `
    })
    contenedor.innerHTML = resultados;
    searchInput.style.display = 'block';
    iLvlInput.style.display = 'block';
    searchClass.style.display = 'block';
    btns.forEach((btn) => { btn.disabled = false });
    rows = document.querySelectorAll('tbody tr');
};

function formatMill(number) {
    let formateado = (number / 1000000).toFixed(1);
    return formateado
}

function formatBill(number) {
    let formateado = (number / 1000000000).toFixed(1);
    return formateado
}

var fileInput = document.getElementById('fileInput');
var submitButton = document.getElementById('btnSubmit');
var hard = document.getElementById('difficulty2');
var gate4 = document.getElementById('gate4');
var banner = document.getElementById('banner');
let id = '3';
let raid = 'akkan';
let difficulty = 'Normal';
let dmg = '20';

fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
        submitButton.hidden = false;
    }
});

fetch(url + raid + '/' + difficulty + '/' + id + '/' + dmg)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.log(error));

function handleRadio(radio, type) {
    btns.forEach((btn) => { btn.disabled = true });
    if (type === 'raid') {
        document.getElementById('btnGate3').checked = true;
        banner.style.backgroundPosition = "center";
        banner.style.backgroundSize = "cover";
        raid = radio.value;
        id = 3;
        gate4.hidden = true;
        hard.hidden = false;

        if (raid === 'akkan') {
            banner.style.backgroundImage = "url(/akkan.jpg)";

        }
        else if (raid === 'voldis') {
            document.getElementById('btnGate4').checked = true;
            banner.style.backgroundImage = "url(/voldis.png)";
            gate4.hidden = false;
            id = 4;
        }
        else if (raid === 'thaemine') {
            document.getElementById('btnDifficulty1').checked = true;
            banner.style.backgroundImage = "url(/thaemine.jpg)";
            banner.style.backgroundPosition = "top";
            hard.hidden = true;
            difficulty = 'Normal';
        }
    }
    else if (type === 'difficulty') {
        difficulty = radio.value;
    }
    else if (type === 'gate') {
        id = radio.value;
    }
    else if (type === 'dmg') {
        dmg = radio.value;
    }

    resultados = '';
    contenedor.innerHTML = resultados;
    fetch(url + raid + '/' + difficulty + '/' + id + '/' + dmg)
        .then(response => response.json())
        .then(data => mostrar(data))
        .catch(error => console.log(error));
}