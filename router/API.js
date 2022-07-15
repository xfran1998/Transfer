const express = require('express');
const path = require('path');
const router = express.Router();
const DB = require(path.join(__dirname, '..', 'database', 'database.js'));

const db_conn = new DB();

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    check_user(username, password, res, req); 
});

router.use((req, res) => {
    console.log('not found api: ' + req.url);
    res.send({code: 404, message: 'not found'});
});

module.exports = router;

async function check_user(username, password, res, req) {
    const is_correct = await db_conn.check_user(username, password);
    
    if (is_correct) {
        let session = req.session;
        session.userid = req.body.username;

        console.log(req.session)
        res.send({code: 200, message: 'ok'});
    }
    else {
        res.send({code: 401, message: 'wrong username or password'});
    }
}