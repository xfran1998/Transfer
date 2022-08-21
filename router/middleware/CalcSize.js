const path = require('path');
const fs = require('fs');
const fastFolderSize = require('fast-folder-size');
const DB = require(path.join(__dirname, '..', '..', 'database', 'database.js'));

const setSize = (req, res, next) => {
    (async () => {
        const size = await get_size_folder(req.body.owner);
        const db = new DB();
        db.connect();
        await db.set_user_size(req.body.owner, size);
        db.close();
    })();
    next();
}

const getSize = async (req, res, next) => {
    const db = new DB();
    db.connect();
    const size = await db.get_user_size(req.params.owner);
    db.close();
    
    res.locals.size = size;
    console.log('size:', size);

    next();
}

function get_size_folder(folder_id) {
    // get size from folder /transfer/folder_id/
    return new Promise((resolve, reject) => {
        const path_folder = path.join(__dirname, '..', '..', 'transfer', folder_id);
        fastFolderSize(path_folder, (err, bytes) => {
            if (err) {
                reject(err);
            }

            resolve(bytes);
        });
    });    
}

module.exports = { setSize, getSize };