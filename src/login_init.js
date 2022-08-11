import { Main } from "./main.js"; 

const type = document.getElementById('login-type').value;
console.log('login: ' + type);

Main.PostFormLogin(type); 
