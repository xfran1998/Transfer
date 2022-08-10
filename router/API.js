const express = require('express');
const path = require('path');
const router = express.Router();
const DB = require(path.join(__dirname, '..', 'database', 'database.js'));
const fs = require('fs');
const fastFolderSize = require('fast-folder-size');
const fileUpload = require('express-fileupload');
const {filePayloadExists, fileSizeLimiter, fileTypeLimiter} = require('./middleware/ManageFiles.js');


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

router.post('/admin/files/edit', (req, res) => {    
    const owner = req.body.owner;
    const file = req.body.file;
    const edit = req.body.edit;

    if (edit.type == 'delete') {
        console.log('delete file');
        const succes = delete_file(owner, file);
        succes ?    res.json({code: 200, message: 'File deleted successfully'}) : 
                    res.json({code: 407, message: 'Error deleting file'});
        return;
    }
    else if (edit.type == 'rename') {
        console.log('rename file');
        const succes = rename_file(owner, file, edit.name);
        console.log(succes);
        succes ?    res.json({code: 200, message: 'File renamed successfully'}) : 
                    res.json({code: 500, message: 'Error renaming file'});
        return;
    }

    console.table({owner, file, edit});
});

router.post('/admin/files/upload', 
    fileUpload({ useTempFiles: true }),
    filePayloadExists,
    fileSizeLimiter,
    fileTypeLimiter,
    (req, res) => {
        console.log('upload file:', req.body.owner);
        const files = req.files;
        console.table(files);
    
        // save file in transfer folder
        const path_folder = path.join(__dirname, '..', 'transfer', req.body.owner);
        Object.keys(files).forEach(key => {
            const file = files[key];
            var file_path = path.join(path_folder, file.name);

            // rename the file if it already exists
            if (fs.existsSync(file_path)) {
                const file_name = file.name.split('.');
                const file_ext = file_name[file_name.length - 1];
                const file_name_new = file_name.slice(0, file_name.length - 1).join('.') + '_' + Date.now() + '.' + file_ext;
                
                file.name = file_name_new;
                file_path = path.join(path_folder, file.name);
            }
            
            
            file.mv(file_path, err => {
                if (err) {
                    console.log(err);
                    return res.json({code: 500, message: 'Error uploading file'});
                }
            } );
        } );

        return res.json({code: 200, message: 'ok'});
});

router.get('/admin/folders/info/:id', (req, res) => {
    console.log('get info folders: ' + req.params.id);
    try {
        (async () => {
            let info = {};
            info.name = req.params.id;
            info.size = await get_size_folder(req.params.id);

            // console.table(info);
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
        res.send({code: 200, message: 'User created successfully'});
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

function rename_file(owner, old_name, new_name){
    // rename file /transfer/owner/old_name to /transfer/owner/new_name
    const path_old = path.join(__dirname, '..', 'transfer', owner, old_name);
    const path_new = path.join(__dirname, '..', 'transfer', owner, new_name);
    fs.rename(path_old, path_new, (err) => {
        if (err) {
            console.log(err);
            return false;
        }
    } );

    return true;
}

function delete_file(owner, name){
    // delete file /transfer/owner/name
    console.log('delete_file: ' + owner + ' ' + name);
    const path_file = path.join(__dirname, '..', 'transfer', owner, name);
    fs.unlink(path_file, (err) => {
        if (err) {
            console.log(err);
            return false;
        }
    } );

    return true;
}