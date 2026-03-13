import { app } from "./firebase.js";

import {

getFirestore,
collection,
addDoc

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const db = getFirestore(app);

window.criarCampeonato = async function(){

let nome = document.getElementById("nomeCamp").value
let console = document.getElementById("console").value
let jogo = document.getElementById("jogo").value
let formato = document.getElementById("formato").value

await addDoc(collection(db,"campeonatos"),{

nome,
console,
jogo,
formato

})

alert("Campeonato criado")

}
