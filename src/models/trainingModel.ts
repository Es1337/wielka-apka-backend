require('../../db-connection');
const mongoose = require('mongoose')

const trainingSchema = mongoose.Schema({
    name: String,
    group: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Group'
    },
    exercises: [
        new mongoose.Schema({
            name: String,
            sets: [
                new mongoose.Schema({
                    user: { type: mongoose.Types.ObjectId, ref: 'googleUser' },
                    weight: Number,
                    reps: Number
                })
            ]
        })
    ]
});

trainingSchema.index({ group: 1 });
const Training = mongoose.model('training', trainingSchema);

module.exports = Training;