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
    }
});

const GoogleUser = mongoose.model('googleUser', GoogleUserSchema);

module.exports = GoogleUserSchema;
module.exports.GoogleUser = GoogleUser;

