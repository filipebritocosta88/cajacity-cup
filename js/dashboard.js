import { app } from "./firebase.js";

import {
getFirestore,
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const db = getFirestore(app);

const lista = document.getElementById("lista")

async function carregarCampeonatos(){

lista.innerHTML=""

const querySnapshot = await getDocs(collection(db,"campeonatos"))

querySnapshot.forEach((doc)=>{

const data = doc.data()

lista.innerHTML += `

<div class="campeonato">

<b>${data.nome}</b><br>

${data.console} • ${data.jogo}<br>

Formato: ${data.formato}

</div>

`

})

}

carregarCampeonatos()

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

alert("Campeonato criado!")

carregarCampeonatos()

}
