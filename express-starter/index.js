'use strict';

const express = require('express');
const morgan = require('morgan');

// Create application
const app = express() ;

// middleware
app.use(morgan('dev'));

// Define routes and web pages
app.get('/', ((request, response) => {
  response.send('Hello!');
  console.log(request.method);
}));

app.get('/studenti/:nome', ((req, res) => {
  res.send(`Ciao ${req.params.nome}`);
}));

app.put('/update', (req, res) => {/*codice*/});



// Activate server
app.listen(3000, () =>	console.log('Server	ready'));
