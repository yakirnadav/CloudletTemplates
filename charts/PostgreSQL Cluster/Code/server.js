'use strict';

const express = require('express');
const https = require('https');
const fs = require('fs');
const Sequelize = require('sequelize')
var key = fs.readFileSync('selfsigned.key');
var cert = fs.readFileSync('selfsigned.crt');
var options = {
    key: key,
    cert: cert
  };
const sequelize = new Sequelize('postgres://myuser:password@sampleapp.pgo.svc.cluster.local:5432/sampleapp')

// Constants
const PORT = 443;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
        res.status(200).send("Connection to database successful");
    }).catch(err => {
        res.status(404).send("Oh uh, something went wrong");
    });
});

app.get('/health-check',(req,res)=> {
    res.send ("Health check passed");
});

app.get('/bad-health',(req,res)=> {
    res.status(500).send('Health check did not pass');
});

var server = https.createServer(options, app);

server.listen(PORT, HOST, () => {
  console.log("server starting on port : " + PORT)
});
console.log(`Running on https://${HOST}:${PORT}`);