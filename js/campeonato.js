// js/campeonato.js
const db = firebase.firestore();
const urlParams = new URLSearchParams(window.location.search);
const campId = urlParams.get('id');

let dadosCampeonato = null;

firebase.auth().onAuthStateChanged(user => {
    if (user && campId) {
        carregarDadosCampeonato(user.uid);
    }
});

function carregarDadosCampeonato(userId) {
    db.collection('campeonatos').doc(campId).get().then(doc => {
        if (doc.exists) {
            dadosCampeonato = doc.data();
            document.getElementById('detalhe-nome').innerText = dadosCampeonato.nome;
            document.getElementById('detalhe-jogo').innerText = dadosCampeonato.jogo;
            document.getElementById('detalhe-formato').innerText = `${dadosCampeonato.console} • ${dadosCampeonato.formato}`;

            // Se for o Host, mostra aba Admin
            if (dadosCampeonato.hostId === userId) {
                document.getElementById('btn-admin-tab').classList.remove('hidden');
                popularSelectsAdmin();
            }
            
            carregarListaParticipantes();
        }
    });
}

function carregarListaParticipantes() {
    const lista = document.getElementById('lista-players-camp');
    lista.innerHTML = "";
    
    // Busca detalhes de cada participante
    dadosCampeonato.participantes.forEach(uid => {
        db.collection('usuarios').doc(uid).get().then(userDoc => {
            const u = userDoc.data();
            lista.innerHTML += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border-bottom: 1px solid #333;">
                    <span><i class="fas fa-user-circle"></i> ${u.nome}</span>
                    <span style="font-size: 0.7rem; color: var(--primary);">TIME: ---</span>
                </div>
            `;
        });
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
}

function popularSelectsAdmin() {
    // Aqui popularíamos os selects com os nomes dos jogadores para registrar resultados
}
