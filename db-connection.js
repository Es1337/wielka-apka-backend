const mongoose = require('mongoose');
const config = require('./config/mongo.json');

const connectionUrl = config['connectionString']

const connect = mongoose.connect(connectionUrl);

module.exports = connect;