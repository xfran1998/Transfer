const express = require('express');
const path = require('path');
const router = express.Router();
const DB = require(path.join(__dirname, '..', 'database', 'database.js'));
const fs = require('fs');
const fileUpload = require('express-fileupload');
const {filePayloadExists, fileSizeLimiter, fileTypeLimiter, fileSaver, removeFile} = require('./middleware/ManageFiles.js');
const { setSize, getSize } = require('./middleware/CalcSize.js');
const DLog = require(path.join(__dirname, '..', 'utils', 'dlog.js'));


router.post('/login', (req, res) => {
    console.log('login:', JSON.stringify(req.body));
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

router.post('/admin/files/edit', 
    removeFile,
    setSize,
    (req, res) => {
        if (req.body.edit.type == 'delete') {
            return res.json({code: 200, message: 'File deleted successfully'});
        }
        if (req.body.edit.type == 'rename') {
            return res.json({code: 200, message: 'File renamed successfully'});
        }
    }
);

router.post('/admin/files/upload', 
    fileUpload({ useTempFiles: true }),
    filePayloadExists,
    fileSizeLimiter,
    fileTypeLimiter,
    fileSaver,
    setSize,
    (req, res) => {
        return res.json({code: 200, message: 'ok'});
    }
);

router.get('/admin/folders/info/:owner', 
    getSize,
    async (req, res) => {
    console.log('get info folders: ' + req.params.owner);
    try {
        let info = {};
        info.name = req.params.owner;
        info.size = res.locals.size;

        res.send({code: 200, message: 'ok', info: info});
        // res.render(path.join('admin', 'folders.ejs', {info: info}));
    }
    catch(error) {
        console.log(error);
    }
});

router.get('/admin/folders/files/:id', async (req, res) => {
    console.log('get files folders: ' + req.params.id);
    try {
        let info = {};
        info.files = get_files_from_folder(req.params.id);
        info.name = req.params.id;
        res.send({code: 200, message: 'ok', info: info});
        // res.render(path.join('admin', 'folders.ejs', {info: info}));
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
        res.send({code: 200, message: 'User created successfully'});
    }
    else {
        res.send({code: 407, message: 'Error creating user'});
    }
}

async function get_all_users(res, req) {
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

async function get_size_user(username) {
    const db_conn = new DB();
    const size = await db_conn.get_size_user(username);
    db_conn.close();
    
    // if (is_correct) {
    //     res.send({code: 200, message: 'ok', users: users});
    // }
    // else {
    //     res.send({code: 407, message: 'Error creating user'});
    // }

    return size;
}

function get_files_from_folder(folder_id) {
    // get all files from folder /transfer/folder_id/
    try {
        const path_folder = path.join(__dirname, '..', 'transfer', folder_id);
        var files = fs.readdirSync(path_folder);


        files = files.map((file) => {
            var size = fs.statSync(path.join(path_folder, file)).size;
            if (size > 1024) {
                // convert bytes to KB
                size /= 1024;
                
                if (size > 1024) {
                    // convert bytes to MB
                    size /= 1024;
                    size = size.toFixed(2) + ' MB';
                }
                else{
                    size = size.toFixed(2) + ' KB';
                }
            }
            else{
                size = size + ' bytes';
            }


            return {
                name: file,
                size: size
            }
        });

        return files;
    }
    catch(error) {
        console.log(error);
        return [];
    }
}