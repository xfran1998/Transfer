const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/api', require(path.join(__dirname, 'router', 'Rutas.js')));

app.use('/', require(path.join(__dirname, 'router', 'Rutas.js')));

app.listen(3000, () => { 
    console.log('Server is running on port 3000'); 
    console.log('db_user: ' + process.env.DB_USERNAME); 
    console.log('db_password: ' + process.env.DB_PASSWORD); 
});

