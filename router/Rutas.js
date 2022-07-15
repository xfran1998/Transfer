const express = require('express');
const path = require('path');
const router = express.Router();
const DEBUG = false;

router.use('/js', express.static(path.join(__dirname, '..', 'public', 'js')));

router.use('/css', express.static(path.join(__dirname, '..', 'public', 'css')));

router.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.get('/test1.html', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'test1.html'));
});

router.get('/test2.html', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'test2.html'));
});

router.use('/', (req, res, next) => {
    // send all static files required of the html
    if (req.url === '/' || req.url === '/index.html') {
        const is_loged = (req.session.userid || DEBUG); 
        res.render('index.ejs', {is_loged: is_loged});
    }
    else{
        next();
    }    
});

router.use((req, res) => {
    // console.log('not found: ' + req.url);
    res.sendFile(path.join(__dirname, '..', 'public', '404.html'));
});

module.exports = router;