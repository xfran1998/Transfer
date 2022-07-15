import { AsyncTransfer } from "./async.js";

class Main {
    static PostFormLogin() {
        let form = document.getElementById('login-form');
        console.log(form);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let username = document.getElementById('username').value;
            let password = document.getElementById('password').value;

            if (Main.ValidForm(form) && Main.CheckUser(username, password)) {
                console.log('login');
            }
            else
                alert('Not valid username or password');    
        });
    }

    static ValidForm(form) {
        let inputs = form.querySelectorAll('input');
        
        // check validity input pattern
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.classList.add('is-invalid');
                console.log('not valid: ' + input.id);
                return false;
            }            
        });
        
        return true;
    }

    static async CheckUser(username, password) {
        const data = {username: username, password: password};

        const json_resp = await AsyncTransfer.PostAPIAsync('http://localhost:3000/api/login', data);

        console.log(json_resp);
    }
}

window.addEventListener('load', () => {
    // check url page
    let url_page = window.location.href;
    let page = url_page.split('/').pop();

    if (page === 'login.html') {
        Main.PostFormLogin();
    }
});