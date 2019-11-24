const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const premiumSchema = new Schema({
    groupID: ObjectId,
    user: ObjectId,
    period: Number,
    senderName: String,
    transactionHash: String,
    amount: String,
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "Approved",
    },
});

module.exports = mongoose.model("premiums", premiumSchema);
