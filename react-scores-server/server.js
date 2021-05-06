'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB

// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json()); // for parsing json request body

/*** API ***/

// GET /api/exams
app.get('/api/exams', (req, res) => {
  dao.listExams()
  .then(exams => res.json(exams))
  .catch(()=> res.status(500).end());
});

// PUT /api/exams/<code>
app.put('/api/exams/:code', [
  check('code').isLength({min:7, max:7}),
  check('score').isInt({min: 18, max: 31}),
  check('date').isDate({format: 'YYYY-MM-DD', strictMode: true})
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    return res.status(422).json({errors: errors.array()});

  const examToUpdate = req.body;
  if(req.params.code === examToUpdate.code) {
    try {
      await dao.updateExam(examToUpdate);
      res.status(200).end();
    } catch(err) {
      res.status(503).json({error: `Database error during the update of exam ${examToUpdate.code}`});
    }
  }
  else return res.status(503).json({error: `Wrong code in the request body.`});
  
});

// Activate the server
app.listen(port, ()=> {
  console.log(`Server started at http://localhost:${port}`);
})