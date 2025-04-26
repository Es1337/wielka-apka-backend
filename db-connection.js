const mongoose = require('mongoose');
const config = require('./config/mongo.json');

const env = process.env.NODE_ENV || "development"
const connectionUrl = config[env]['connectionString']

const connect = mongoose.connect(connectionUrl);

module.exports = connect;