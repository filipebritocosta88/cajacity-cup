// js/dashboard.js
const authDash = firebase.auth();
const dbDash = firebase.firestore();

// 1. Carregar dados do usuário no cabeçalho
authDash.onAuthStateChanged(user => {
    if (user) {
        dbDash.collection('usuarios').doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const dados = doc.data();
                document.getElementById('user-welcome').innerText = dados.nome;
                if (dados.foto) {
                    document.getElementById('header-avatar').src = dados.foto;
                }
            }
        });
        carregarCampeonatos();
    }
});

// 2. Criar novo campeonato
const btnCriar = document.getElementById('btn-criar-camp');
if (btnCriar) {
    btnCriar.addEventListener('click', () => {
        const nome = document.getElementById('camp-nome').value;
        const console = document.getElementById('camp-console').value;
        const jogo = document.getElementById('camp-jogo').value;
        const formato = document.getElementById('camp-formato').value;
        const user = authDash.currentUser;

        if (!nome || !console || !jogo) {
            return alert("Preencha todos os campos do campeonato!");
        }

        dbDash.collection('campeonatos').add({
            nome: nome,
            console: console,
            jogo: jogo,
            formato: formato,
            hostId: user.uid,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'inscricoes', // status inicial
            participantes: [user.uid] // Host entra automaticamente
        })
        .then(() => {
            alert("Campeonato criado com sucesso!");
            document.getElementById('camp-nome').value = "";
            carregarCampeonatos();
        })
        .catch(err => alert("Erro ao criar: " + err.message));
    });
}

// 3. Carregar Lista de Campeonatos
function carregarCampeonatos() {
    const listaDiv = document.getElementById('lista-campeonatos');
    
    dbDash.collection('campeonatos').orderBy('criadoEm', 'desc').get().then(snapshot => {
        listaDiv.innerHTML = ""; // Limpa a mensagem de carregando

        if (snapshot.empty) {
            listaDiv.innerHTML = '<p style="text-align:center; color:#666;">Nenhum campeonato ativo.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const camp = doc.data();
            const card = document.createElement('div');
            card.className = 'card-campeonato';
            card.innerHTML = `
                <div class="card-header">
                    <span class="game-badge">${camp.jogo}</span>
                    <span style="font-size: 0.8rem; color: #888;">${camp.console}</span>
                </div>
                <h3 style="margin: 10px 0;">${camp.nome}</h3>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span style="font-size: 0.85rem; color: var(--primary);">
                        <i class="fas fa-users"></i> ${camp.participantes ? camp.participantes.length : 1} jogadores
                    </span>
                    <button class="btn-primary" style="width: auto; padding: 8px 20px; font-size: 0.8rem;" 
                            onclick="abrirCampeonato('${doc.id}')">
                        Ver Detalhes
                    </button>
                </div>
            `;
            listaDiv.appendChild(card);
        });
    });
}

// Função para navegar até a página do campeonato específico
function abrirCampeonato(id) {
    window.location.href = `campeonato.html?id=${id}`;
}
