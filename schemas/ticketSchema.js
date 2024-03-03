const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    channelId:{
        type: String,
        required: true,
    },
    nickname: {
        type: String,
    },
    device: {
        type: String
    },
    category: {
        type: String,
    },
    topic: {
        type: String,
    },
    issue: {
        type: String,
    },
    status: {
        type: String,
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    assignedTo: {
        type: String,
        default: 'unassigned'
    },
    closingReason: {
        type: String,
    }
});

module.exports = mongoose.model('ticketSchema', ticketSchema);