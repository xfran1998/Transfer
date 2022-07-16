const express = require('express');
const path = require('path');
const router = express.Router();
const DB = require(path.join(__dirname, '..', 'database', 'database.js'));

const db_conn = new DB();

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const admin = (req.body.type == 'admin') ? 1 : 0;

    check_user(username, password, admin, res, req); 
});

router.post('/create_user', (req, res) => {
    const is_loged = req.session.adminid; 


    if (!is_loged) {
        res.send({code: 402, message: 'not loged'});
        return;
    }
    
    const user = req.body.user;
    const password = req.body.password;
    const del_date = req.body.del_date;

    console.log('create_user:', user, password, del_date);
    create_user(user, password, del_date, res, req); 
});

router.use((req, res) => {
    console.log('not found api: ' + req.url);
    res.send({code: 404, message: 'not found'});
});

module.exports = router;

async function check_user(username, password, admin, res, req) {
    const is_correct = await db_conn.check_user(username, password, admin);
    
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
    
    const is_correct = await db_conn.create_user(username, password, del_date);
    
    if (is_correct) {
        res.send({code: 200, message: 'ok'});
    }
    else {
        res.send({code: 407, message: 'Error creating user'});
    }
}