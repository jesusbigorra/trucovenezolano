const pintas = ['Espada', 'Basto', 'Oro', 'Copa'];
const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

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

// Genera el diseño interno de la carta simulando el patrón español
function generarCardHTML(carta, index, esInteractiva = false) {
    const clasePinta = carta.pinta.toLowerCase();
    const emoji = emojisPintas[carta.pinta];
    
    // Multiplicamos los emojis en el centro según el número para que parezca una baraja real
    let centroHTML = '';
    if (carta.valor <= 7) {
        centroHTML = Array(carta.valor).fill(`<span class="icono-mini">${emoji}</span>`).join('');
    } else {
        // Figuras (10, 11, 12) muestran un icono grande estilizado
        centroHTML = `<span class="icono-grande">${emoji}</span>`;
    }

    const clickAtributo = esInteractiva ? `onclick="jugarCarta(${index}, '${carta.valor}', '${carta.pinta}')"` : '';

    return `
        <div class="carta ${clasePinta}" ${clickAtributo} id="mi-carta-${index}">
            <div class="orla-interna">
                <div class="top-left">${carta.valor}</div>
                <div class="pinta-centro-patron">${centroHTML}</div>
                <div class="bottom-right">${carta.valor}</div>
            </div>
        </div>
    `;
}

let misCartasActuales = [];

function iniciarMano() {
    let baraja = crearBaraja();
    barajar(baraja);

    let vira = baraja.pop();
    misCartasActuales = [baraja.pop(), baraja.pop(), baraja.pop()];

    // 1. Renderizar Vira fija en su contenedor de la esquina
    const viraDisplay = document.getElementById('vira-display');
    viraDisplay.className = `carta vira-volteada ${vira.pinta.toLowerCase()}`;
    viraDisplay.innerHTML = generarCardHTML(vira, 0, false);

    // 2. Renderizar Tu Mano (Habilitando clicks)
    const manoContainer = document.getElementById('mano-container');
    manoContainer.innerHTML = misCartasActuales.map((c, idx) => generarCardHTML(c, idx, true)).join("");

    // 3. Limpiar por completo el centro de la mesa (Campo de batalla)
    document.getElementById('tapete-batalla').innerHTML = "";
}

// Lógica para tirar la carta al centro
function jugarCarta(index, valor, pinta) {
    const cartaDOM = document.getElementById(`mi-carta-${index}`);
    if (!cartaDOM) return;

    // Clonamos la carta para moverla al centro de la batalla
    const tapete = document.getElementById('tapete-batalla');
    
    const nuevaCartaMesa = cartaDOM.cloneNode(true);
    nuevaCartaMesa.removeAttribute('onclick'); // Ya en la mesa no se le hace click
    nuevaCartaMesa.style.transform = `rotate(${(Math.random() * 10) - 5}deg)`; // Un toque de rotación realista
    
    tapete.appendChild(nuevaCartaMesa);

    // Desaparece de tu mano
    cartaDOM.style.visibility = 'hidden';
}
