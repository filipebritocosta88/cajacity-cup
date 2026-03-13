// js/auth.js

// Referências
const auth = firebase.auth();
const db = firebase.firestore();

// LOGIN
const btnEntrar = document.getElementById('btn-entrar');
if (btnEntrar) {
    btnEntrar.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;

        auth.signInWithEmailAndPassword(email, senha)
            .then(() => {
                window.location.href = 'dashboard.html';
            })
            .catch(error => alert("Erro ao entrar: " + error.message));
    });
}

// CADASTRO
const btnCadastrar = document.getElementById('btn-cadastrar');
if (btnCadastrar) {
    btnCadastrar.addEventListener('click', () => {
        const nome = document.getElementById('reg-nome').value;
        const email = document.getElementById('reg-email').value;
        const senha = document.getElementById('reg-senha').value;

        if (nome === "") return alert("Escolha um nome de jogador!");

        auth.createUserWithEmailAndPassword(email, senha)
            .then(cred => {
                // Salva dados adicionais no Firestore
                return db.collection('usuarios').doc(cred.user.uid).set({
                    nome: nome,
                    email: email,
                    foto: "",
                    estatisticas: {
                        jogos: 0,
                        vitorias: 0,
                        empates: 0,
                        derrotas: 0,
                        gols: 0
                    }
                });
            })
            .then(() => {
                window.location.href = 'dashboard.html';
            })
            .catch(error => alert("Erro ao cadastrar: " + error.message));
    });
}

// Observador de Autenticação (Proteção de Rotas)
auth.onAuthStateChanged(user => {
    const path = window.location.pathname;
    const isLoginPage = path.endsWith('index.html') || path.endsWith('/');

    if (user) {
        if (isLoginPage) window.location.href = 'dashboard.html';
    } else {
        if (!isLoginPage) window.location.href = 'index.html';
    }
});

// LOGOUT
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}
