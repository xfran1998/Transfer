import { AsyncTransfer } from "./async.js";

class Main extends AsyncTransfer {
    static PostFormLogin() {
        let form = document.getElementById('login-form');
        console.log(form);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            Main.LoginUser(form);
        });
    }

    static async LoginUser(form) {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;

        if (Main.ValidForm(form)) {
            const is_valid_user = await Main.CheckUser(username, password);

            if (is_valid_user) 
                Main.ReplacePage('main-body', '/index.html');
        }
        else
            alert('Not valid username or password');    

        return false;
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

    static GetDataForm(form) {
        let inputs = form.querySelectorAll('input');
        
        let data = {};
        inputs.forEach(input => {
            data[input.id] = input.value;         
        });
        
        return data;
    }

    static async CheckUser(username, password) {
        const data = {username: username, password: password};

        // const json_resp = await AsyncTransfer.PostAPIAsync('http://localhost:3000/api/login', data);
        const json_resp = await Main.PostAPIAsync('http://localhost:3000/api/login', data);

        return json_resp.code === 200;
    }

    static async DownloadFile(file_name) {
        Main.GetAsync('./download/' + file_name);
    }

    static SetButtonsDownload() {
        let buttons = document.querySelectorAll('.btn-download');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                const name = e.target.getAttribute('data-name');
                console.log(name);
                Main.DownloadFile(name);
            });
        });
    }
    
    static async DownloadFile(name) {
        const response = await Main.GetAsync('/download/' + name);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.click();
    }
}

export { Main };