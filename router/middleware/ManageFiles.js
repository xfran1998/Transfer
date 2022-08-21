const path = require('path');
const fs = require('fs');

const GB = 1;
const SIZE_LIMIT = GB * 1024 * 1024 * 1024; // 1GB
const EXT_ALLOWED = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.mp3', '.mp4', '.avi', '.wmv', '.mov', '.flv', '.ogg', '.webm', '.wav', '.zip', '.rar', '.exe'];

const filePayloadExists = (req, res, next) => {
    if (!req.files) return res.status(400).json({status: 'error', message: 'No files were uploaded.'});
    if (!req.body.owner) return res.status(400).json({status: 'error', message: 'No owner was provided.'});
    
    return next();
};

const fileSizeLimiter = (req, res, next) => {
    const files = req.files;
    const filesNotAllowed = [];

    Object.keys(files).forEach(key => {
        const file = files[key];
        if (file.size > SIZE_LIMIT) {
            filesNotAllowed.push(file.name);
        }
    } );

    if (!filesNotAllowed.length) return next(); // no files were not allowed

    let string_msg = '<p style="font-size: 1.4rem">Files size greater 1GB:</p>'; 
    filesNotAllowed.forEach(file => {
        string_msg += '<p>' + file + '</p>';
    } );

    // string_msg = string_msg.slice(0, -2);
    // string_msg += '.';
    

    return res.status(400).json({status: 'error', message: string_msg}); // some files were not allowed
}

const fileTypeLimiter = (req, res, next) => {
    const files = req.files;
    const extNotAllowed = [];

    Object.keys(files).forEach(key => {
        const file = files[key];
        const fileExtension = path.extname(file.name);
        
        if (!EXT_ALLOWED.includes(fileExtension)) {
            extNotAllowed.push(file.name);
        }
    });

    if (!extNotAllowed.length) return next(); // no files were not allowed

    let string_msg = '<p style="font-size: 1.4rem">Types not allowed:</p>';
    extNotAllowed.forEach(file => {
        string_msg += '<p>' + file + '</p>';
    } );

    string_msg = string_msg.slice(0, -2);
    string_msg += '.';

    return res.status(400).json({status: 'error', message: string_msg}); // some files were not allowed
}

const fileSaver = async (req, res, next) => {
    console.log('upload file:', req.body.owner);
    const files = req.files;
    // console.table(files);

    // save file in transfer folder
    const path_folder = path.join(__dirname, '..', '..', 'transfer', req.body.owner);
    for (const key of Object.keys(files)) {
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
        
        
        await file.mv(file_path, err => {
            if (err) {
                console.log(err);
                return res.json({code: 500, message: 'Unexpected error uploading file'});
            }
        } );
    }

    next();
}

const removeFile = (req, res, next) => {    
    const owner = req.body.owner;
    const file = req.body.file;
    const edit = req.body.edit;

    if (edit.type == 'delete') {
        console.log('delete file');
        const succes = delete_file(owner, file);

        if (!succes)
            return res.json({code: 407, message: 'Error deleting file'});
    }
    else if (edit.type == 'rename') {
        console.log('rename file');
        const succes = rename_file(owner, file, edit.name);
        
        if (!succes) 
            return res.json({code: 500, message: 'Error renaming file'});
    }

    next();
}

function rename_file(owner, old_name, new_name){
    // rename file /transfer/owner/old_name to /transfer/owner/new_name
    const path_old = path.join(__dirname, '..', '..', 'transfer', owner, old_name);
    const path_new = path.join(__dirname, '..', '..', 'transfer', owner, new_name);
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
    const path_file = path.join(__dirname, '..',  '..', 'transfer', owner, name);
    fs.unlink(path_file, (err) => {
        if (err) {
            console.log(err);
            return false;
        }
    } );

    return true;
}

module.exports =  {filePayloadExists, fileSizeLimiter, fileTypeLimiter, fileSaver, removeFile};