const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

// Import variables from .env
require('dotenv').config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/api', require(path.join(__dirname, 'router', 'Rutas.js')));

app.use('/api', require(path.join(__dirname, 'router', 'API.js')));
app.use('/', require(path.join(__dirname, 'router', 'Rutas.js')));

app.listen(3000, () => { 
    console.log('Server is running on port 3000'); 
});


