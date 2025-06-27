require('../../db-connection');
const mongoose = require('mongoose')

const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'googleUser' },
    sets: [
        new mongoose.Schema({
            weight: { type: Number, required: true },
            reps: { type: Number, required: true },
            count: { type: Number, default: 0 },
        })
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

const trainingSchema = mongoose.Schema({
    trainingName: { 
        type: String
    },
    group: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Group'
    },
    exercises: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'exercise'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

trainingSchema.index({ group: 1 });
const Training = mongoose.model('training', trainingSchema);
const Exercise = mongoose.model('exercise', exerciseSchema);

module.exports = { Training, Exercise };