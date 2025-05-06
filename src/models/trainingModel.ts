require('../../db-connection');
const mongoose = require('mongoose')

const trainingSchema = mongoose.Schema({

});

const Training = mongoose.model('training', trainingSchema);

module.exports = Training;