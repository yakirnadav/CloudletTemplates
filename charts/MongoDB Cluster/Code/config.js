// config.js

var config = {
    app: {
        app_name: process.env.APPLICATION_NAME
    },
    db: {
      username: process.env.DB_USERNAME || '',
      password: process.env.DB_PASSWORD || '',
      namespace: process.env.NAMESPACE || 'mongodb-cluster',
      replicaset: process.env.REPLICA_SET || 'rs0'
    } 
  }