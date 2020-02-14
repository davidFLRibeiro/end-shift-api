require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const shiftRouter = require('./shifts/shift-router');
const shiftService = require('./shifts/shift-service');

const app = express();

//const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());
app.use('/api/shifts', shiftRouter);

app.get('/shifts', (req, res, next) => {
  const knexInstance = req.app.get('db');
  shiftService
    .getAllShifts(knexInstance)
    .then(shifts => {
      res.json(shifts);
    })
    .catch(next);
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
