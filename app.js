const pintas = ['Espada', 'Basto', 'Oro', 'Copa'];
const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

document.getElementById('btn-repartir').addEventListener('click', iniciarMano);

function crearBaraja() {
    let baraja = [];
    for (let pinta of pintas) {
        for (let valor of valores) {
            baraja.push({ valor: valor, pinta: pinta });
        }
    }
    return baraja;
}

function barajar(baraja) {
    for (let i = baraja.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baraja[i], baraja[j]] = [baraja[j], baraja[i]];
    }
    return baraja;
}

function calcularTantos(mano, vira) {
    let tienePerico = mano.some(c => c.valor === 11 && c.pinta === vira.pinta);
    let tienePerica = mano.some(c => c.valor === 10 && c.pinta === vira.pinta);
    
    let piezas = [];
    if (tienePerico) piezas.push(11);
    if (tienePerica) piezas.push(10);

    let comunes = mano.filter(c => !(c.pinta === vira.pinta && (c.valor === 11 || c.valor === 10)));

    let esFlor = false;
    if (piezas.length === 2) {
        esFlor = true; 
    } else if (piezas.length === 1) {
        if (comunes.length === 2 && comunes[0].pinta === comunes[1].pinta) esFlor = true;
    } else {
        if (comunes.length === 3 && comunes[0].pinta === comunes[1].pinta && comunes[1].pinta === comunes[2].pinta) esFlor = true;
    }

    if (esFlor) return "¡TIENES FLOR! 🌸";

    if (comunes.length >= 2) {
        let porPinta = {};
        comunes.forEach(c => {
            if (!porPinta[c.pinta]) porPinta[c.pinta] = [];
            porPinta[c.pinta].push(c);
        });

        for (let p in porPinta) {
            if (porPinta[p].length === 2) {
                let v1 = porPinta[p][0].valor < 10 ? porPinta[p][0].valor : 0;
                let v2 = porPinta[p][1].valor < 10 ? porPinta[p][1].valor : 0;
                return `Envido: ${20 + v1 + v2} Puntos`;
            }
        }
    }

    let valoresAltos = comunes.map(c => c.valor < 10 ? c.valor : 0);
    let maxCarta = valoresAltos.length > 0 ? Math.max(...valoresAltos) : 0;
    return `Envido: ${maxCarta} Puntos`;
}

function generarCardHTML(carta) {
    const clasePinta = carta.pinta.toLowerCase();
    return `<div class="carta ${clasePinta}">
                <span>${carta.valor}</span>
                <span style="font-size:0.7rem;">${carta.pinta}</span>
            </div>`;
}

function iniciarMano() {
    let baraja = crearBaraja();
    barajar(baraja);

    let vira = baraja.pop();
    let miMano = [baraja.pop(), baraja.pop(), baraja.pop()];

    const viraDisplay = document.getElementById('vira-display');
    viraDisplay.className = `carta ${vira.pinta.toLowerCase()}`;
    viraDisplay.innerHTML = `<span>${vira.valor}</span><span style="font-size:0.7rem;">${vira.pinta}</span>`;

    const manoContainer = document.getElementById('mano-container');
    manoContainer.innerHTML = miMano.map(generarCardHTML).join("");

    let resultadoTantos = calcularTantos(miMano, vira);
    document.getElementById('envido-display').innerText = resultadoTantos;
}
