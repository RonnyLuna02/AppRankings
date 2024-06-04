const url = 'http://localhost:3000/'
const contenedor = document.querySelector('tbody')
let searchInput = document.getElementById('search')
let searchClass = document.getElementById('searchClass')
let iLvlInput = document.getElementById('searchItemLvl')
let btns = document.querySelectorAll('input');
var rows;
let resultados = '';

searchInput.addEventListener('keyup', function (event) {
    const q = event.target.value.toLowerCase();
    rows.forEach((row) => {
        console.log(row.querySelector('td').textContent)
        row.querySelector('#name').textContent.toLowerCase().startsWith(q) ? (row.style.display = 'table-row') : (row.style.display = 'none')
    });
});

searchClass.addEventListener('keyup', function (event) {
    const q = event.target.value.toLowerCase();
    rows.forEach((row) => {
        console.log(row.querySelector('td').textContent)
        row.querySelector('#class').textContent.toLowerCase().startsWith(q) ? (row.style.display = 'table-row') : (row.style.display = 'none')
    });
});


iLvlInput.addEventListener('keyup', function (event) {
    const q = event.target.value;
    debugger
    if (q.length === 4) {
        rows.forEach((row) => {
            console.log(row.querySelector('td').textContent)
            if (row.querySelector('#itemLvl').textContent > q) {
                row.style.display = 'none'
                debugger
            } else {
                row.style.display = 'table-row'
            }
        });
    } else {
        rows.forEach((row) => {
            row.style.display = 'table-row'
        });
    }
    debugger
});

const mostrar = (players) => {
    let id = 0;
    players.sort((a, b) => b.maxDps - a.maxDps);
    players.forEach(player => {
        id++
        resultados += `<tr>
                    <td>${id}</td>
                    <td id="name">${player.name}</td>
                    <td id="class">${player.class}</td>
                    <td id="itemLvl">${player.itemLvl}</td>
                    <td>${player.maxDps}</td>
                    <td>${player.minDps}</td>
                    <td>${player.averageDps}</td>
                    <td>${player.tries}</td>
                    <td>${player.clears}</td>
                </tr>
                `
    })
    contenedor.innerHTML = resultados;
    btns.forEach((btn) => { btn.disabled = false });
    searchInput.style.display = 'block';
    iLvlInput.style.display = 'block';
    searchClass.style.display = 'block';
    rows = document.querySelectorAll('tbody tr');
};

var hard = document.getElementById('difficulty2');
var gate4 = document.getElementById('gate4');
var banner = document.getElementById('banner');
let id = '3';
let raid = 'akkan';
let difficulty = 'Hard';
let dmg = '0';

fetch(url + raid + '/' + difficulty + '/' + id + '/' + dmg)
        .then(response => response.json())
        .then(data => mostrar(data))
        .catch(error => console.log(error));

function handleRadio(radio, type){
    if(type === 'raid'){    
        document.getElementById('btnGate3').checked = true;
        raid = radio.value;
        id = 3;
        gate4.hidden = true;        
        hard.hidden = false;

        if(raid === 'akkan'){
            banner.style.backgroundImage="url(/akkan.jpg)";
        }
        else if(raid === 'voldis'){
            document.getElementById('btnGate4').checked = true;
            banner.style.backgroundImage="url(/voldis.png)";
            gate4.hidden = false;
            id = 4;
        }
        else if(raid === 'thaemine'){
            document.getElementById('btnDifficulty1').checked = true;
            banner.style.backgroundImage="url(/thaemine.jpg)";
            hard.hidden = true;
            difficulty = 'Normal';
        }
    }
    else if(type === 'difficulty'){
        difficulty = radio.value;
    }
    else if(type === 'gate'){
        id = radio.value;
    }
    else if(type === 'dmg'){
        dmg = radio.value;
    }
    contenedor.innerHTML = '';
    fetch(url + raid + '/' + difficulty + '/' + id + '/' + dmg)
        .then(response => response.json())
        .then(data => mostrar(data))
        .catch(error => console.log(error));
}