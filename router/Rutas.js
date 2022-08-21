const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const DB = require(path.join(__dirname, '..', 'database', 'database.js'));
const DLog = require(path.join(__dirname, '..', 'utils', 'dlog.js'));

const DEBUG = false;

router.use('/js', express.static(path.join(__dirname, '..', 'public', 'js')));
router.use('/css', express.static(path.join(__dirname, '..', 'public', 'css')));
router.use('/img', express.static(path.join(__dirname, '..', 'public', 'img')));

router.use('/', (req, res, next) => {
    console.log('index user');
    DLog.log('index user');
    // get url
    const url = req.url;
    
    const is_loged = (req.session.userid);
    if (!is_loged) {
        console.log('not loged user');
        DLog.log('not loged user');
        res.render('login.ejs', {type: 'user'}); 
        return;
    }

    next();
});

router.get('/login.html', (req, res) => {
    try{
        console.log('get login');
        const is_loged = (req.session.userid || DEBUG); 
        if (is_loged) 
            res.redirect('/');
        else
            res.render('login.ejs', {type: 'user'});
    }
    catch(err){
        DLog.error(err.message);
        res.send(err);
    }
});

router.get('/download/:file', (req, res) => {
    // send all static files required of the html
    const data = { is_loged: (req.session.userid || DEBUG) };
    // const file = req.query.file;
    const file = req.params.file;

    if (data.is_loged && file) {
        data.files = GetFilesFromFolder(path.join(__dirname, '..', 'transfer', req.session.userid));
        
        // if file exists download it
        if (data.files.includes(file)) {
            res.download(path.join(__dirname, '..', 'transfer', req.session.userid, file));
        }
    }
});

router.use('/', (req, res, next) => {
    // send all static files required of the html
    // if (req.url === '/' || req.url === '/index.html') {
    //     const data = { is_loged: (req.session.userid || DEBUG) };
    //     if (data.is_loged) {
    //         data.files = GetFilesFromFolder(path.join(__dirname, '..', 'transfer', req.session.userid));
    //     }
    
    //     res.render('index.ejs', data);
    // }
    // else{
    //     next();
    // }    

    try {
        const data = { is_loged: req.session.userid };
        data.files = GetFilesFromFolder(path.join(__dirname, '..', 'transfer', req.session.userid));
        DLog.log('get index');
        DLog.log(JSON.stringify(data));

        
        res.render('index.ejs', data);
    }
    catch(err){
        DLog.error(err.message);
        res.send(err);
    }
});

router.use((req, res) => {
    // console.log('not found: ' + req.url);
    res.sendFile(path.join(__dirname, '..', 'public', '404.html'));
});

function GetFilesFromFolder(folder) {
    const files = fs.readdirSync(folder);
    // const js_files = files.filter(file => path.extname(file) === '.js');
    return files;
}

module.exports = router;