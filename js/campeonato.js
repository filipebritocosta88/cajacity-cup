const db = firebase.firestore();
const urlParams = new URLSearchParams(window.location.search);
const campId = urlParams.get('id');

const TIMES_DATA = {
    br: [ {n: "Flamengo", s: "fla"}, {n: "Palmeiras", s: "pal"}, {n: "São Paulo", s: "spa"}, {n: "Corinthians", s: "cor"} ],
    es: [ {n: "Real Madrid", s: "rma"}, {n: "Barcelona", s: "bar"}, {n: "Atlético Madrid", s: "atm"} ],
    en: [ {n: "Man City", s: "mci"}, {n: "Liverpool", s: "liv"}, {n: "Arsenal", s: "ars"}, {n: "Man United", s: "mun"} ],
    it: [ {n: "Juventus", s: "juv"}, {n: "Inter", s: "int"}, {n: "Milan", s: "mil"} ]
};

let dadosCamp = null;
let timesOcupados = {};

firebase.auth().onAuthStateChanged(user => {
    if (user && campId) {
        db.collection('campeonatos').doc(campId).onSnapshot(doc => {
            dadosCamp = doc.data();
            timesOcupados = dadosCamp.timesEscolhidos || {};
            atualizarInterface(user.uid);
        });
    }
});

function atualizarInterface(uid) {
    document.getElementById('detalhe-nome').innerText = dadosCamp.nome;
    document.getElementById('detalhe-jogo').innerText = dadosCamp.jogo;
    
    // Verifica se eu já escolhi time
    if (timesOcupados[uid]) {
        document.getElementById('meu-time-badge').classList.remove('hidden');
        document.getElementById('time-selecionado-display').innerText = timesOcupados[uid];
    }

    if (dadosCamp.hostId === uid) {
        document.getElementById('btn-admin-tab').classList.remove('hidden');
        carregarUsuariosParaConvidar();
    }
    renderizarTimesPorLiga();
    carregarTabelaConfirmados();
}

function renderizarTimesPorLiga() {
    const liga = document.getElementById('select-liga').value;
    const grid = document.getElementById('grid-times');
    grid.innerHTML = "";

    TIMES_DATA[liga].forEach(time => {
        const jaEscolhido = Object.values(timesOcupados).includes(time.n);
        const meuTime = timesOcupados[firebase.auth().currentUser.uid] === time.n;

        const btn = document.createElement('div');
        btn.className = `card-campeonato ${jaEscolhido ? 'ocupado' : ''}`;
        btn.style = `margin:0; padding:10px; text-align:center; cursor:${jaEscolhido ? 'not-allowed' : 'pointer'}; border-bottom: 2px solid ${meuTime ? 'var(--primary)' : '#333'}`;
        btn.innerHTML = `
            <img src="https://ssl.gstatic.com/onebox/media/sports/logos/unique_id_${time.s}.png" onerror="this.src='https://via.placeholder.com/30?text=FC'" style="width:30px;"><br>
            <small>${time.n}</small>
            ${jaEscolhido ? '<br><span style="font-size:10px; color:red;">OCUPADO</span>' : ''}
        `;
        
        if (!jaEscolhido) {
            btn.onclick = () => selecionarTime(time.n);
        }
        grid.appendChild(btn);
    });
}

async function selecionarTime(nomeTime) {
    const uid = firebase.auth().currentUser.uid;
    // Salva no objeto timesEscolhidos do campeonato
    const updateObj = {};
    updateObj[`timesEscolhidos.${uid}`] = nomeTime;
    
    await db.collection('campeonatos').doc(campId).update(updateObj);
    alert("Time " + nomeTime + " selecionado!");
}

function carregarTabelaConfirmados() {
    const div = document.getElementById('lista-participantes-times');
    div.innerHTML = "";
    dadosCamp.participantes.forEach(async pid => {
        const uDoc = await db.collection('usuarios').doc(pid).get();
        const time = timesOcupados[pid] || "Escolhendo...";
        div.innerHTML += `
            <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #222;">
                <span>${uDoc.data().nome}</span>
                <span style="color:var(--primary); font-weight:bold;">${time}</span>
            </div>`;
    });
}

function carregarUsuariosParaConvidar() {
    const lista = document.getElementById('lista-jogadores-sistema');
    db.collection('usuarios').limit(10).get().then(snap => {
        lista.innerHTML = "";
        snap.forEach(uDoc => {
            if (uDoc.id !== firebase.auth().currentUser.uid && !dadosCamp.participantes.includes(uDoc.id)) {
                lista.innerHTML += `
                    <div class="card-campeonato" onclick="enviarConvite('${uDoc.id}', '${uDoc.data().nome}')" style="background:#111; margin-bottom:5px;">
                        <i class="fas fa-plus"></i> ${uDoc.data().nome}
                    </div>`;
            }
        });
    });
}

function enviarConvite(id, nome) {
    db.collection('convites').add({
        paraId: id, campId: campId, campNome: dadosCamp.nome, status: 'pendente', deNome: "Host"
    }).then(() => alert("Convite enviado!"));
}

function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}
