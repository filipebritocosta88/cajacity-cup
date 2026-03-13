import { app } from "./firebase.js";

import {
getAuth
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
getFirestore,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const auth = getAuth(app)
const db = getFirestore(app)

window.salvarPerfil = async function(){

let user = auth.currentUser

let nome = document.getElementById("nome").value

await setDoc(doc(db,"usuarios",user.uid),{

nome

})

alert("Perfil salvo!")

}

window.logout = function(){

auth.signOut()

window.location="index.html"

}
