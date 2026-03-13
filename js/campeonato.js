const db = firebase.firestore();
const urlParams = new URLSearchParams(window.location.search);
const campId = urlParams.get('id');
let dadosCamp = null;
let meuNome = "";

firebase.auth().onAuthStateChanged(user => {
    if (user && campId) {
        db.collection('usuarios').doc(user.uid).get().then(u => meuNome = u.data().nome);
        
        db.collection('campeonatos').doc(campId).onSnapshot(doc => {
            dadosCamp = doc.data();
            document.getElementById('detalhe-nome').innerText = dadosCamp.nome;
            document.getElementById('detalhe-jogo').innerText = dadosCamp.jogo;
            
            if (dadosCamp.hostId === user.uid) {
                document.getElementById('btn-admin-tab').classList.remove('hidden');
                carregarTodosUsuarios();
            }
            carregarPlayersConfirmados();
        });
    }
});

function carregarPlayersConfirmados() {
    const lista = document.getElementById('lista-players-camp');
    lista.innerHTML = "";
    dadosCamp.participantes.forEach(uid => {
        db.collection('usuarios').doc(uid).get().then(uDoc => {
            const data = uDoc.data();
            lista.innerHTML += `
                <div style="display:flex; align-items:center; gap:10px; padding:10px; border-bottom:1px solid #333;">
                    <img src="${data.foto || 'https://via.placeholder.com/30'}" style="width:30px; border-radius:50%">
                    <span>${data.nome}</span>
                </div>`;
        });
    });
}

function carregarTodosUsuarios() {
    const listaGeral = document.getElementById('lista-todos-usuarios');
    db.collection('usuarios').limit(20).get().then(snap => {
        listaGeral.innerHTML = "";
        snap.forEach(uDoc => {
            const user = uDoc.data();
            // Não listar a si mesmo e nem quem já está no camp
            if (uDoc.id !== firebase.auth().currentUser.uid && !dadosCamp.participantes.includes(uDoc.id)) {
                const item = document.createElement('div');
                item.className = 'card-campeonato';
                item.style = "margin-bottom: 5px; padding: 10px; cursor: pointer; background: #252a33";
                item.innerHTML = `<span><i class="fas fa-plus-circle"></i> ${user.nome}</span>`;
                item.onclick = () => enviarConvite(uDoc.id, user.nome);
                listaGeral.appendChild(item);
            }
        });
    });
}

function enviarConvite(idConvidado, nomeConvidado) {
    db.collection('convites').add({
        deId: firebase.auth().currentUser.uid,
        deNome: meuNome,
        paraId: idConvidado,
        campId: campId,
        campNome: dadosCamp.nome,
        status: 'pendente'
    }).then(() => alert("Convite enviado para " + nomeConvidado));
}

function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}
