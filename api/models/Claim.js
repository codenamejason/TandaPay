// NOTE: This is just a placeholder for now and will likely be rewritten soon

const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const claimSchema = new Schema({
    groupID: ObjectId,
    creatorID: ObjectId,
    creatorName: String,
    summary: String,
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
    claimAmount: Number,
});

module.exports = mongoose.model("claims", claimSchema);
