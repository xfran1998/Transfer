const $ = (s, o = document) => o.querySelector(s);
const $$ = (s, o = document) => o.querySelectorAll(s);

const login = $('#login-form');
const user = $('#user', login);
const passwordContainer = $('.password', login);
const password = $('input', passwordContainer);
const passwordList = $('.dots', passwordContainer);
const submit = $('button', login);
const MAX_PASSWORD_LENGTH = 15;
const form_type = $('#login-type', login).value;


let cursor_pos = 0;
let pass_length = 0;

password.addEventListener('input', e => {
    if(password.value.length > $$('i', passwordList).length) {
        // passwordList.appendChild(document.createElement('i'));

        let dots = password.value.length - $$('i', passwordList).length
        for(let i = 0; i < dots; i++) {
            passwordList.appendChild(document.createElement('i'));
            cursor_pos++;
            pass_length++;
            console.log('dots');
            console.log(cursor_pos);
            console.log(pass_length);
        }
    }

    submit.disabled = !password.value.length;
    passwordContainer.style.setProperty('--cursor-x', cursor_pos * 10 + 'px');
});

let pressed = false;

password.addEventListener('keydown', e => {
    /* SPECIAL KEYS

        8: backspace
        13: enter
        35: end
        36: home
        37: left
        39: right
        46: delete

    */
    const especial_keys = [9, 13, 35, 36, 37, 39, 46];

    if(pressed || login.classList.contains('processing') || (password.value.length > MAX_PASSWORD_LENGTH && !especial_keys.includes(e.keyCode))) {
        console.log('prevented');
        pass_length++;
        e.preventDefault();
    }

    pressed = true;

    setTimeout(() => pressed = false, 50);

    // Delete btn
    if(e.keyCode == 8) {

        let last = $$('i', passwordList)[cursor_pos-1];
        console.log('last');
        console.log('pass_length');
        console.log(pass_length);

        if(last) {
            pass_length--;
            cursor_pos = (cursor_pos > MAX_PASSWORD_LENGTH) ? MAX_PASSWORD_LENGTH : password.value.length-1;
            console.log('cursor_pos');
            console.log(cursor_pos);
            console.log('pass_length');
            console.log(pass_length);

            last.classList.add('remove');
            setTimeout(() => last.remove(), 50);
        }
    }

    // Supr btn
    if(e.keyCode == 46) {
        let last = $$('i', passwordList)[cursor_pos];
        if(last) {
            pass_length--;
            console.log('last');
            last.classList.add('remove');
            setTimeout(() => last.remove(), 50);
        }
    }

    // Move cursor to the left (prevent going over the password)
    if (e.keyCode == 37) {
        cursor_pos--;
        if (cursor_pos < 0) {
            cursor_pos = 0;
        }
        
        passwordContainer.style.setProperty('--cursor-x', cursor_pos * 10 + 'px');
    }

    // Move cursor to the left (prevent going over the password)
    if (e.keyCode == 39) {
        cursor_pos++;
        if (cursor_pos > password.value.length) {
            cursor_pos = password.value.length;
        }

        passwordContainer.style.setProperty('--cursor-x', cursor_pos * 10 + 'px');
    }

    // End btn
    if (e.keyCode == 35) {
        cursor_pos = password.value.length;
        passwordContainer.style.setProperty('--cursor-x', cursor_pos * 10 + 'px');        
    }

    // start btn
    if (e.keyCode == 36) {
        cursor_pos = 0;
        passwordContainer.style.setProperty('--cursor-x', cursor_pos * 10 + 'px');        
    }


});

password.addEventListener('select', function() {
    this.selectionStart = this.selectionEnd;
});

password.addEventListener('click', (e) => {
    let pos = e.offsetX;
    let i = Math.floor(pos / 10) + 1;
    cursor_pos = (i > cursor_pos) ? cursor_pos : i;
    console.log(cursor_pos);
    passwordContainer.style.setProperty('--cursor-x', cursor_pos * 10 + 'px');
});

login.addEventListener('submit', async(e) => {
    e.preventDefault();

    if(!login.classList.contains('processing')) {
        login.classList.add('processing');
        setTimeout(async () => {            
            const res = await user_login(user.value, password.value, form_type);
            console.log(res);

            if (res.code == 200) window.location.reload();

            // let cls = password.value == 'password' ? 'success' : 'error';
            let cls = res.code == 200 ? 'success' : 'error';
            console.log(password.value);

            login.classList.add(cls);
            setTimeout(async() => {
                login.classList.remove('processing', cls);
                if(cls == 'error') {
                    password.value = '';
                    passwordList.innerHTML = '';
                    submit.disabled = true;
                }
                else{
                    // reload page
                    window.location.reload();
                }
            }, 2000);
            setTimeout(async () => {
                if(cls == 'error') {
                    passwordContainer.style.setProperty('--cursor-x', 0 + 'px');
                    console.log('reset cursor');
                    cursor_pos = 0;
                    pass_length = 0;
                }
            }, 600);
        }, 1500);
    }
});

async function user_login(username, password, type) {
    const response = await fetch(
        '/api/login',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                type
            })
        }
    )

    const data = await response.json();
    return data;
}
