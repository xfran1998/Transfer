import { AsyncTransfer } from "./async.js";

class Main extends AsyncTransfer {
    static PostFormLogin(type) {
        let form = document.getElementById('login-form');
        console.log(form);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            Main.LoginUser(form, type);
        });
    }

    static async PostForm(id_form){
        const form = document.getElementById(id_form);
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            Main.PostData(form);
        });
    }
    
    static async PostData(form) {
        const url = form.getAttribute('action');
        const data = Main.GetDataForm(form);
        
        // check if url string contains 'api'
        if (url.includes('api')) {
            console.log('api');
            const resp_data = await Main.PostAPIAsync(url, data);
            return resp_data;
        }
        else {
            console.log('not api');
            const resp_data = await Main.PostTextAsync(url, data);
            return resp_data;
        }
    }

    static async GetDataForm(form){
        let inputs = form.querySelectorAll('input');

        let data = {};
        inputs.forEach(input => {
            data[input.id] = input.value;
        });

        return data;
    }

    static async SetNavMenu(id_nav) {
        const nav_pages = document.querySelectorAll(`#${id_nav} li a`);
        nav_pages.forEach(page => {
            page.addEventListener('click', (e) => {
                (async () => {
                    e.preventDefault();
                    // const path = "https://transfers.insolectric.com" + e.currentTarget.getAttribute('href');
                    const url = "http://localhost:3000" + e.currentTarget.getAttribute('href');
                    const replace_id = e.currentTarget.getAttribute('data-replace');
                    Main.ReplacePage(replace_id, url);
                })();
            });
        });
    }

    static async LoginUser(form, type) {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;

        if (Main.ValidForm(form)) {
            const is_valid_user = await Main.CheckUser(username, password, type);
            console.log(type);

            if (is_valid_user) 
                if (type == 'admin')
                    Main.ReplacePage('main-body', '/admin');
                else
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

    static async CheckUser(username, password, type) {
        const data = {username: username, password: password, type: type};

        const json_resp = await AsyncTransfer.PostAPIAsync('http://localhost:3000/api/login', data);
        // const json_resp = await Main.PostAPIAsync('https://transfers.insolectric.com/api/login', data);

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

    // static async LogOut(type_logout) {
    //     const json_resp = await AsyncTransfer.PostAPIAsync('http://localhost:3000/api/logout', {type: type_logout});
    //     // const json_resp = await Main.PostAPIAsync('https://transfers.insolectric.com/api/logout',  {type: type_logout});

    //     if (json_resp.code === 200) {
    //         Main.ReplacePage('main-body', 'http://localhost:3000/admin');
    //     }
    //     else {
    //         alert('Error al cerrar sesión');
    //     }
    // }
    
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