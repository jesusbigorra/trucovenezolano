const pintas = ['Espada', 'Basto', 'Oro', 'Copa'];
const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

// Mapeo de emojis para que parezcan barajas tradicionales
const emojisPintas = {
    'Espada': '⚔️',
    'Basto': '🪵',
    'Oro': '🪙',
    'Copa': '🏆'
};

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

function generarCardHTML(carta) {
    const clasePinta = carta.pinta.toLowerCase();
    const emoji = emojisPintas[carta.pinta];
    return `
        <div class="carta ${clasePinta}">
            <div class="top-left">${carta.valor}</div>
            <div class="pinta-centro">${emoji}</div>
            <div class="bottom-right">${carta.valor}</div>
        </div>
    `;
}

function iniciarMano() {
    let baraja = crearBaraja();
    barajar(baraja);

    let vira = baraja.pop();
    let miMano = [baraja.pop(), baraja.pop(), baraja.pop()];

    // Renderizar Vira (volteada en la esquina del mazo)
    const viraDisplay = document.getElementById('vira-display');
    viraDisplay.className = `carta vira-volteada ${vira.pinta.toLowerCase()}`;
    viraDisplay.innerHTML = generarCardHTML(vira);

    // Renderizar Tu Mano (abajo a la izquierda)
    const manoContainer = document.getElementById('mano-container');
    manoContainer.innerHTML = miMano.map(generarCardHTML).join("");

    // Limpiar el centro de la mesa para la nueva batalla
    document.getElementById('tapete-batalla').innerHTML = "";
}
