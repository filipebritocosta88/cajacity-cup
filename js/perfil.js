// js/perfil.js
const authPerfil = firebase.auth();
const dbPerfil = firebase.firestore();

authPerfil.onAuthStateChanged(user => {
    if (user) {
        dbPerfil.collection('usuarios').doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const d = doc.data();
                document.getElementById('display-nome').innerText = d.nome;
                document.getElementById('display-email').innerText = d.email;
                document.getElementById('edit-nome').value = d.nome;
                document.getElementById('edit-foto-url').value = d.foto || "";
                
                if (d.foto) {
                    document.getElementById('profile-img-big').src = d.foto;
                    document.getElementById('header-avatar').src = d.foto;
                }

                // Estatísticas
                if (d.estatisticas) {
                    document.getElementById('stat-gols').innerText = d.estatisticas.gols || 0;
                    document.getElementById('stat-vitorias').innerText = d.estatisticas.vitorias || 0;
                    document.getElementById('stat-jogos').innerText = d.estatisticas.jogos || 0;
                }
            }
        });
    }
});

document.getElementById('btn-salvar-perfil').addEventListener('click', () => {
    const novoNome = document.getElementById('edit-nome').value;
    const novaFoto = document.getElementById('edit-foto-url').value;
    const user = authPerfil.currentUser;

    dbPerfil.collection('usuarios').doc(user.uid).update({
        nome: novoNome,
        foto: novaFoto
    }).then(() => {
        alert("Perfil atualizado com sucesso!");
        location.reload();
    });
});
