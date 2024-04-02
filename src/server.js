
//"use strict"
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser'); 
const app = express();
//const os = require('os');
const dlcHelpers = require("./helpers");
const vConsts = require("./consts");
//const fs = require('fs'); 

/*
if (!vConsts.funcCheckServer() == ''){
    console.log(vConsts.funcCheckServer());
    return;
};
*/

//const __serverPortHttps = 3001; 
//const __serverPortHttp = 3000;

const __serverPortHttp = 3000; 
const __serverIp = 'localhost';

const http = require('http');
//const { Socket } = require('dgram');
//const userInfo = os.userInfo();

// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'ISNAMDYxMjkxOTJDZmk=',
  resave: false,
  saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Use path.join para construir o caminho correto

//** routes */
require('./routes/app')(app);

var server = http.createServer(app);
server.listen(__serverPortHttp);    


    server.on('listening', () => {

        console.log(`Server running at: http://${__serverIp}:${__serverPortHttp}/`);        
    })   
    server.on('error', (error) => {
        console.log(`Server NOT running at: http://${__serverIp}:${__serverPortHttp}/${error}`);        
        dlcHelpers.writeLog(`Server NOT running at: http://${__serverIp}:${__serverPortHttp}/${error}`);                
    });
    
    