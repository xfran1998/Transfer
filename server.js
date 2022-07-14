const express = require('express');
const app = express();
const path = require('path');

// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/api', require(path.join(__dirname, 'router', 'Rutas.js')));

app.use('/', require(path.join(__dirname, 'router', 'Rutas.js')));

app.listen(3000, () => { console.log('Server is running on port 3000'); });

