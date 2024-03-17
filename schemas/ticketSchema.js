const {Schema, model} = require('mongoose');

const ticketSchema = new Schema({
    autoIncrement: {
        type: Number,
        // required: true,
        unique: true,
    },
    userId: {
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
    premium: {
        type: String
    },
    category: {
        type: String,
    },
    subcategory: {
        type: String,
    },
    topic: {
        type: String,
    },
    issue: {
        type: String,
    },
    newaccount: {
        type: String,
    },
    secondaccount: {
        type: String,
    },
    date: {
        type: String,
    },
    devrole: {
        type: String,
    },
    userreport: {
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
    },
    addedUsers: {
        type: [String],
    },
    transcriptHTML: {
        type: String
    }
});

ticketSchema.pre('save', async function (next) {
    if (!this.isNew) return next();
    try {
        lastDocument = await this.constructor.findOne({}, {}, { sort: { autoIncrement: -1 } });
        if (lastDocument) {
            this.autoIncrement = lastDocument.autoIncrement + 1;
        } else {
            this.autoIncrement = 1;
        }
        next();
    }
    catch (err) { next(err); }
});

module.exports = model('ticketSchema', ticketSchema);