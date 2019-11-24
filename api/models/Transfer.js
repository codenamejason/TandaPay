const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const transferSchema = new Schema({
    senderID: ObjectId,
    receiverID: ObjectId,
    type: String,
    receiverName: String,
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

module.exports = mongoose.model("transfer", transferSchema);
