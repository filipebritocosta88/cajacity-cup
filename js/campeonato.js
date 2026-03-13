import { app } from "./firebase.js";

import {

getFirestore,
collection,
addDoc

} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const db = getFirestore(app);

window.escolherTime = async function(){

let time = document.getElementById("time").value

await addDoc(collection(db,"times"),{

time

})

alert("Time escolhido")

}
