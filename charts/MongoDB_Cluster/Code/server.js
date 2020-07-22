'use strict';

const express = require('express');
var MongoClient = require('mongodb').MongoClient;


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const URI = "mongodb://root:admin@bitnami-mongodb-cluster-ocp43-prod-0.bitnami-mongodb-cluster-ocp43-prod-headless.mongodb-cluster.svc.cluster.local,bitnamimongodb-cluster-ocp43-prod-1,bitnami-mongodb-cluster-ocp43-prod-headless.mongodb-cluster.svc.cluster.local,bitnami-mongodb-cluster-ocp43-prod-2.bitnami-mongodb-cluster-ocp43-prod-headless.mongdb-cluster.svc.cluster.local/?authSource=admin&replicaSet=rs0"

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

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);