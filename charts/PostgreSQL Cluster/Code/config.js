// config.js

var config = {
    app: {
        app_name: process.env.APPLICATION_NAME || "sampleapp"
    },
    db: {
      username: process.env.DB_USERNAME || 'myuser',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DATABASE || 'sampledb',
    } 
  }

module.exports = config;