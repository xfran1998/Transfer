const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const DB = require(path.join(__dirname, '..', 'database', 'database.js'));

// router.use('/js', express.static(path.join(__dirname, '..', 'public', 'js')));
// router.use('/css', express.static(path.join(__dirname, '..', 'public', 'css')));
// router.use('/img', express.static(path.join(__dirname, '..', 'public', 'img')));

router.use('/', (req, res, next) => {
    console.log('get admin1');
    // get url
    const url = req.url;
    
    const is_loged = (req.session.adminid);
    if (!is_loged) {
        console.log('login admin');
        res.render('login.ejs', {type: 'admin'}); 
        return;
    }
    next();
});


router.get('/users', (req, res) => {
    console.log('users');
    try {
        (async () => {
            const db_conn = new DB();
            const users = await db_conn.get_all_users();
            db_conn.close();
        
            res.render(path.join('admin', 'users.ejs'), {users: users});
        })();  
    }
    catch (err) {
        console.log(err);
    }  
});

router.get('/folders', (req, res) => {
    console.log('get folders');
    try {
        (async () => {
            const db_conn = new DB();
            const users = await db_conn.get_all_users();
            db_conn.close();

            let folders = [];
            users.forEach(user => {
                folders.push(user.username);
            });
        
            console.table(folders);
            res.render(path.join('admin', 'folders.ejs'), {folders: folders});
        })();  
    }
    catch(error) {
        console.log(error);
    }
});

router.get('/logout', (req, res) => {
    console.log('logout admin');
    
    delete req.session.adminid;
    res.render('login.ejs', {type: 'admin'});
});

router.get('/', (req, res, next) => {
    console.log('get admin2');
    res.render(path.join('admin', 'admin.ejs'));
});

router.use((req, res) => {
    // console.log('not found: ' + req.url);
    res.sendFile(path.join(__dirname, '..', 'public', '404.html'));
});

module.exports = router;