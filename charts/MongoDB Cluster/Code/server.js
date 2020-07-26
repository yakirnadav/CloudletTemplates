'use strict';

const express = require('express');
const https = require('https');
const fs = require('fs');
var key = fs.readFileSync('selfsigned.key');
var cert = fs.readFileSync('selfsigned.crt');
var options = {
    key: key,
    cert: cert
  };
var MongoClient = require('mongodb').MongoClient;


// Constants
const PORT = 443;
const HOST = '0.0.0.0';
const URI = "mongodb://root:admin@node-mongodb-ocp43-prod-0.node-mongodb-ocp43-prod-headless.mongodb-cluster.svc.cluster.local,bitnamimongodb-cluster-ocp43-prod-1,node-mongodb-ocp43-prod-headless.mongodb-cluster.svc.cluster.local,node-mongodb-ocp43-prod-2.node-mongodb-ocp43-prod-headless.mongdb-cluster.svc.cluster.local/?authSource=admin&replicaSet=rs0"

// App
const app = express();
app.get('/', (req, res) => {
    // Connect to the db
    MongoClient.connect(URI, function (err, db) {
    
        if(err) {
            res.status(404).send("Oh uh, something went wrong");
        };

        res.status(200).send("Connection to database successful");
        //Write databse Insert/Update/Query code here..
                
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