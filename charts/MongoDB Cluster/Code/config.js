// config.js

var config = {
    app: {
        app_name: process.env.APPLICATION_NAME || "sampleapp"
    },
    db: {
      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DATABASE || 'sampledb',
      namespace: process.env.NAMESPACE || 'mongodb-cluster',
      replicaset: process.env.REPLICA_SET || 'rs0'
    } 
  }

module.exports = config;