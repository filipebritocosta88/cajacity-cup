import { app } from "./firebase.js";

import {

getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth(app);

window.criarConta = async function(){

let email = document.getElementById("email").value
let senha = document.getElementById("senha").value

await createUserWithEmailAndPassword(auth,email,senha)

window.location.href="dashboard.html"

}

window.login = async function(){

let email = document.getElementById("email").value
let senha = document.getElementById("senha").value

await signInWithEmailAndPassword(auth,email,senha)

window.location.href="dashboard.html"

}
