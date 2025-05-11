require('../../db-connection');
const { Schema, model } = require('mongoose')

const GroupSchema = new Schema({
    groupName: {
        type: String
    },
    users: [
        { type: Schema.Types.ObjectId, ref: 'googleUser' }
    ],
    date: {
        type: Date, default: Date.now()
    }
});

GroupSchema.index({ users: 1 });

const Group = model('Group', GroupSchema);

module.exports = Group;