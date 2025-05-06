require('../../db-connection');
import mongoose from "./mongoose";

const trainingSchema = mongoose.Schema({

});

const Training = mongoose.model('training', trainingSchema);

module.exports = Training;