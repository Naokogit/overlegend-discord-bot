const {Schema, model} = require("mongoose");
// const { randomUUID } = require('crypto');

const suggestionSchema = new Schema(
    {
        //sId: { type: String, default: randomUUID,},
        autoIncrement: {
            type: Number,
            unique: true,
        },
        userId: {
            type: String,
            required: true,
        },
        messageId: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            // "pending", "approved", "rejected"
            default: "pending",
        },
        upvotes: {
            type: [String],
            default: [],
        },
        downvotes: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

suggestionSchema.pre('save', async function (next) {
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

module.exports = model('suggestionSchema', suggestionSchema);