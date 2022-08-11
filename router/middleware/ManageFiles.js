const path = require('path');

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

module.exports =  {filePayloadExists, fileSizeLimiter, fileTypeLimiter};