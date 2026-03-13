const auth = firebase.auth();
const db = firebase.firestore();

// Ação de Login
if (document.getElementById('btn-entrar')) {
    document.getElementById('btn-entrar').onclick = () => {
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;
        auth.signInWithEmailAndPassword(email, senha).catch(err => alert("Acesso negado: " + err.message));
    };
}

// Ação de Cadastro com Nick Único
if (document.getElementById('btn-cadastrar')) {
    document.getElementById('btn-cadastrar').onclick = async () => {
        const nome = document.getElementById('reg-nome').value.trim();
        const email = document.getElementById('reg-email').value;
        const senha = document.getElementById('reg-senha').value;

        if (nome.length < 3) return alert("Nick muito curto!");

        const snap = await db.collection('usuarios').where('nome', '==', nome).get();
        if (!snap.empty) {
            document.getElementById('nome-aviso').style.display = 'block';
            return;
        }

        auth.createUserWithEmailAndPassword(email, senha).then(cred => {
            return db.collection('usuarios').doc(cred.user.uid).set({
                nome: nome, email, foto: "", estatisticas: { jogos: 0, vitorias: 0, gols: 0 }
            });
        }).catch(err => alert(err.message));
    };
}

// Observador para redirecionar automático
auth.onAuthStateChanged(user => {
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    if (user) {
        if (isLoginPage) window.location.href = 'dashboard.html';
    } else {
        if (!isLoginPage) window.location.href = 'index.html';
    }
});

function logout() { auth.signOut(); }
