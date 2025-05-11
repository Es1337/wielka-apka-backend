require('../../db-connection');
const mongoose = require('mongoose')

export const GoogleUserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    friends: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'googleUser' }
    ],
});

const GoogleUser = mongoose.model('googleUser', GoogleUserSchema);

module.exports = GoogleUserSchema;
module.exports.GoogleUser = GoogleUser;

