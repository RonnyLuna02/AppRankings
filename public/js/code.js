const url = 'http://localhost:3000/Thaeminen/'
const contenedor = document.querySelector('tbody')
let searchInput = document.getElementById('search')
var rows;

searchInput.addEventListener('keyup', function (event) {
    const q = event.target.value.toLowerCase();
    rows.forEach((row) => {
        console.log(row.querySelector('td').textContent)
        row.querySelector('#name').textContent.toLowerCase().startsWith(q) ? (row.style.display = 'table-row') : (row.style.display = 'none')
    });
});
let resultados = '';

const mostrar = (players) => {
    let id = 0;
    players.sort((a, b) => b.maxDps - a.maxDps);
    players.forEach(player => {
        id++
        resultados += `<tr>
                    <td>${id}</td>
                    <td id="name">${player.name}</td>
                    <td>${player.class}</td>
                    <td>${player.itemLvl}</td>
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
    rows = document.querySelectorAll('tbody tr');

};
let id = 3;
let difficulty = 'Normal';
fetch(url + difficulty + '/' + id)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.log(error));


