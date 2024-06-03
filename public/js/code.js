const url = 'http://localhost:3000/'
const contenedor = document.querySelector('tbody')
let searchInput = document.getElementById('search')
let searchClass = document.getElementById('searchClass')
let iLvlInput = document.getElementById('searchItemLvl')
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
    if(players != ''){
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
        searchInput.style.display = 'block';
        iLvlInput.style.display = 'block';
        searchClass.style.display = 'block';
        rows = document.querySelectorAll('tbody tr');
    }
    else{
        contenedor.innerHTML = '<div></div>';
    }
};

let id = '/1';
let raid = 'akkan';
let difficulty = '/Hard';
let dmg = '/0';

fetch(url + raid + difficulty + id + dmg)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.log(error));

function handleRadio(radio, type){
    if(type === 'raid'){
        raid = radio.value;
        if(raid === 'akkan'){
            document.getElementById('banner').style.backgroundImage="url(/akkan.jpg)";
        }
        else if(raid === 'voldis'){
            document.getElementById('banner').style.backgroundImage="url(/voldis.png)";
        }
        else if(raid === 'thaemine'){
            document.getElementById('banner').style.backgroundImage="url(/thaemine.jpg)";
        }
    }
    else if(type === 'difficulty'){
        difficulty = radio.value || '/Normal';
    }
    else if(type === 'gate'){
        id = radio.value || '/1';
    }
    else if(type === 'dmg'){
        dmg = radio.value || '/0';
    }
    fetch(url + raid + difficulty + id + dmg)
        .then(response => response.json())
        .then(data => mostrar(data))
        .catch(error => console.log(error));
}