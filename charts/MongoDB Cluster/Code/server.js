'use strict';

const express = require('express');
const config = require('./config');
const https = require('https');
const fs = require('fs');
var key = fs.readFileSync('selfsigned.key');
var cert = fs.readFileSync('selfsigned.crt');
var mongoCa = fs.readFileSync('/certificates/sampleapp.crt');
var mongoKey = fs.readFileSync('/certificates/sampleapp.pem');
var options = {
    key: key,
    cert: cert
};
var MongoClient = require('mongodb').MongoClient;
const URI = "mongodb://"+ config.db.username + ":" + config.db.password + "@" + config.app.app_name + "-0." + config.app.app_name + "-headless." + config.db.namespace + ".svc.cluster.local," + config.app.app_name + "-1." + config.app.app_name + "-headless." + config.db.namespace + ".svc.cluster.local," + config.app.app_name + "-2." + config.app.app_name + "-headless." + config.db.namespace + ".svc.cluster.local/?tls=true&authSource=" + config.db.database + "&replicaSet=" + config.db.replicaset
const client = new MongoClient(URI, {
  tlsCA: mongoCa,
  tlsCertificateKey: mongoKey,
  tlsInsecure: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true
});

console.log(config);
console.log(client)
// Constants
const PORT = 8443;
const HOST = '0.0.0.0';

console.log(URI);
// App
const app = express();
app.get('/', (req, res) => {
    // Connect to the db
    client.connect( function (err, db) {

        if (err) {
            res.status(404).send("Oh uh, something went wrong");
            client.close();
        };

        res.status(200).send("Connection to database successful");
        //Write databse Insert/Update/Query code here..
        client.close();
    });
});

app.get('/health-check', (req, res) => {
    res.send("Health check passed");
});

app.get('/bad-health', (req, res) => {
    res.status(500).send('Health check did not pass');
});

var server = https.createServer(options, app);

server.listen(PORT, HOST, () => {
    console.log("server starting on port : " + PORT)
});
console.log(`Running on https://${HOST}:${PORT}`);