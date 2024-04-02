"use strict"

//const usuarios = require('../models/js/login');
//const vConsts = require('../consts');
//const cReadPDF = require('../models/js/readPDF');
//const { async } = require('validate.js');
//const { json } = require('express');

module.exports = (app) => {

  app.get('/', (req, res) => {
    res.render('index')
  }); 

};


