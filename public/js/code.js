const url = 'http://localhost:3000/'
const contenedor = document.querySelector('tbody')
let searchInput = document.getElementById('search')
let searchClass = document.getElementById('searchClass')
let iLvlInput = document.getElementById('searchItemLvl')
let btns = document.querySelectorAll('input');
var rows;
let resultados = '';

function getLogs() {
    let raid = document.querySelector('input[name="btnRaid"]:checked').value;
    let difficulty = document.querySelector('input[name="btnDifficulty"]:checked').value;
    let id = document.querySelector('input[name="btnGate"]:checked').value;
    let dmg = document.querySelector('input[name="btnDmgDealt"]:checked').value;
    let btns = document.querySelectorAll('input');
    let gate4 = document.getElementsByName('gate4');
    let hardest = document.getElementsByName('hardest');

    if (raid === 'voldis') {
        gate4[0].style.display = "block";
    } else {
        gate4[0].style.display = "none";
    }
    if (raid === 'thaemine') {
        hardest[0].style.display = "none";
    } else {
        hardest[0].style.display = "block";
    }
    btns.forEach((btn) => { btn.disabled = true });
    resultados = '';
    contenedor.innerHTML = resultados;
    debugger
    fetch(url + raid + '/' + difficulty + '/' + id + '/' + dmg)
        .then(response => response.json())
        .then(data => mostrar(data))
        .catch(error => console.log(error));
}


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

