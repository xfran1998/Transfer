const express = require('express');
const path = require('path');
const router = express.Router();
const DB = require(path.join(__dirname, '..', 'database', 'database.js'));
const fs = require('fs');
const fastFolderSize = require('fast-folder-size');


router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const admin = (req.body.type == 'admin') ? 1 : 0;
    
    check_user(username, password, admin, res, req); 
});

router.post('/logout', (req, res) => {
    // remove session user/admin id
    console.log('logout: ' + req.body.type);
    
    if (req.body.type == 'admin')
        delete req.session.adminid;
    else
        delete req.session.userid;
    
    res.send({code: 200, message: 'ok'});
});

router.use('/admin', (req, res, next) => {
    console.log('API admin');
    const is_loged = req.session.adminid; 
    
    if (!is_loged) {
        res.send({code: 402, message: 'not loged'});
        return;
    }
    
    console.log('API admin loged');
    next();
});

router.post('/admin/create_user', (req, res) => {    
    const user = req.body.user;
    const password = req.body.password;
    const del_date = req.body.del_date;

    console.log('create_user:', user, password, del_date);
    create_user(user, password, del_date, res, req); 
    create_folder(user);
});

router.get('/admin/folders/info/:id', (req, res) => {
    console.log('get info folders: ' + req.params.id);
    try {
        (async () => {
            let info = {};
            info.name = req.params.id;
            info.size = await get_size_folder(req.params.id);

            console.table(info);
            res.send({code: 200, message: 'ok', info: info});
            // res.render(path.join('admin', 'folders.ejs', {info: info}));
        })();  
    }
    catch(error) {
        console.log(error);
    }
});

router.get('/admin/folders/files/:id', (req, res) => {
    console.log('get files folders: ' + req.params.id);
    try {
        (async () => {
            let info = {};
            info.files = get_files_from_folder(req.params.id);
            info.name = req.params.id;
            console.table(info);
            res.send({code: 200, message: 'ok', info: info});
            // res.render(path.join('admin', 'folders.ejs', {info: info}));
        })();  
    }
    catch(error) {
        console.log(error);
    }
});

router.use((req, res) => {
    console.log('not found api: ' + req.url);
    res.send({code: 404, message: 'not found'});
});

module.exports = router;

async function create_folder(username) {
    const path_folder = path.join(__dirname, '..', 'transfer', username);
    if (!fs.existsSync(path_folder)) {
        fs.mkdir(path_folder, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!')
        });
    }
}

async function check_user(username, password, admin, res, req) {
    const db_conn = new DB();
    const is_correct = await db_conn.check_user(username, password, admin);
    db_conn.close();
    
    if (is_correct) {
        let session = req.session;
        
        if (admin) {
            req.session.adminid = username;
        }
        else {
            session.userid = req.body.username;
        }

        res.send({code: 200, message: 'ok'});
    }
    else {
        res.send({code: 401, message: 'wrong username or password'});
    }
}

async function create_user(username, password, del_date, res, req) {
    if (del_date == '') {
        del_date = null;
    }
    const db_conn = new DB();
    console.log('create_user:', username, password, del_date);
    const is_correct = await db_conn.create_user(username, password, del_date);
    db_conn.close();
    
    if (is_correct) {
        res.send({code: 200, message: 'ok'});
    }
    else {
        res.send({code: 407, message: 'Error creating user'});
    }
}

async function send_all_users(res, req) {
    const db_conn = new DB();
    const users = await db_conn.get_all_users();
    db_conn.close();
    
    if (is_correct) {
        res.send({code: 200, message: 'ok', users: users});
    }
    else {
        res.send({code: 407, message: 'Error creating user'});
    }
}

function get_files_from_folder(folder_id) {
    // get all files from folder /transfer/folder_id/
    try {
        const path_folder = path.join(__dirname, '..', 'transfer', folder_id);
        const files = fs.readdirSync(path_folder);
        return files;
    }
    catch(error) {
        console.log(error);
        return [];
    }
}

function get_size_folder(folder_id) {
    // get size from folder /transfer/folder_id/
    return new Promise((resolve, reject) => {
        const path_folder = path.join(__dirname, '..', 'transfer', folder_id);
        fastFolderSize(path_folder, (err, bytes) => {
            if (err) {
                reject(err);
            }

            if (bytes > 1024) {
                // convert bytes to KB
                bytes /= 1024;
                
                if (bytes > 1024) {
                    // convert bytes to MB
                    bytes /= 1024;
                    resolve(bytes.toFixed(2) + ' MB');
                }
                
                resolve(bytes.toFixed(2) + ' KB');
            }

            resolve(bytes + ' bytes');
        });
    });    
}