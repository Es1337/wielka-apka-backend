import { ref } from "process";

require('../../db-connection');
const mongoose = require('mongoose')

const setSchema = mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'googleUser' },
    weight: Number,
    reps: Number
});

const trainingSchema = mongoose.Schema({
    trainingName: { 
        type: String
    },
    group: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Group'
    },
    exercises: [
        new mongoose.Schema({
            name: String,
            series: [
                new mongoose.Schema({
                    sets: [ { type: mongoose.Types.ObjectId, ref: 'set' }],
                })
            ]
        })
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

trainingSchema.index({ group: 1 });
const Training = mongoose.model('training', trainingSchema);
const Set = mongoose.model('set', setSchema);

module.exports = { Training, Set };