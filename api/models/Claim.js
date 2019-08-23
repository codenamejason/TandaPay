const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const claimSchema = new Schema({
    groupID: ObjectId,
    claimantID: ObjectId,
    claimantName: String,
    summary: String,
    amount: Number,
    documents: [String],
    status: {
        type: String,
        validate: [
            {
                validator: value => {
                    return (
                        value === "pending" ||
                        value === "approved" ||
                        value === "denied"
                    );
                },
                message: "{VALUE} is not a valid claim status",
            },
        ],
    },
});

module.exports = mongoose.model("claims", claimSchema);
