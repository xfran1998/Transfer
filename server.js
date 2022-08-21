const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const DLog = require(path.join(__dirname, 'utils', 'dlog.js'));
// const Bundler = require('parcel-bundler');

const { setup_cron } = require(path.join(__dirname, 'setup.js'));

// Import variables from .env
require('dotenv').config();

// const bundlerOptions = { production: process.env.NODE_ENV === 'production' };
// const bundler        = new Bundler( filePath, bundlerOptions );

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

app.use('/admin', require(path.join(__dirname, 'router', 'Admin.js')));
app.use('/api', require(path.join(__dirname, 'router', 'API.js')));
app.use('/', require(path.join(__dirname, 'router', 'Rutas.js')));

app.listen(3000, () => { 
    console.log('Server is running'); 
});

// DLog.debug_all();

setup_cron();