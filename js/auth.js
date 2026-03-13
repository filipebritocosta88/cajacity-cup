const auth = firebase.auth();
const db = firebase.firestore();

// LOGIN
if (document.getElementById('btn-entrar')) {
    document.getElementById('btn-entrar').addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;
        auth.signInWithEmailAndPassword(email, senha)
            .catch(err => alert("Erro: " + err.message));
    });
}

// CADASTRO COM VERIFICAÇÃO DE NOME ÚNICO
if (document.getElementById('btn-cadastrar')) {
    document.getElementById('btn-cadastrar').addEventListener('click', async () => {
        const nome = document.getElementById('reg-nome').value.trim();
        const email = document.getElementById('reg-email').value;
        const senha = document.getElementById('reg-senha').value;

        if (nome.length < 3) return alert("Nick muito curto!");

        // Verifica se nome já existe
        const snapshot = await db.collection('usuarios').where('nome', '==', nome).get();
        if (!snapshot.empty) {
            document.getElementById('nome-aviso').style.display = 'block';
            return;
        }

        auth.createUserWithEmailAndPassword(email, senha)
            .then(cred => {
                return db.collection('usuarios').doc(cred.user.uid).set({
                    nome: nome,
                    email: email,
                    foto: "",
                    estatisticas: { jogos: 0, vitorias: 0, empates: 0, derrotas: 0, gols: 0 }
                });
            })
            .catch(err => alert(err.message));
    });
}

// PROTEÇÃO DE ROTA
auth.onAuthStateChanged(user => {
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    if (user) {
        if (isIndex) window.location.href = 'dashboard.html';
    } else {
        if (!isIndex) window.location.href = 'index.html';
    }
});

function logout() { auth.signOut(); }
