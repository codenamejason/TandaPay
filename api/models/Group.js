// NOTE: This is just a placeholder for now and will likely be rewritten soon

const mongoose = require("mongoose");
const validator = require("validator");
const subgroupSchema = require("./Subgroup");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const generateAccessCode = require("../lib/accessCode");

const groupSchema = new Schema({
    secretary: {
        name: {
            type: String,
            required: true,
            trim: true,
            minlenth: 1,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            validate: [
                {
                    validator: value => {
                        return validator.isEmail(value);
                    },
                    message: "{VALUE} is not a valid email.",
                },
            ],
        },
        phone: String,
    },
    members: [
        { id: ObjectId, name: String, profile: String, standing: String },
    ],
    groupName: String,
    premium: String,
    groupDocs: [String],
    groupStanding: String,
    subgroups: [subgroupSchema],
    accessCode: String,
});

groupSchema.pre("save", next => {
    if (!this.accessCode) this.accessCode = generateAccessCode();
    next();
});

module.exports = mongoose.model("groups", groupSchema);
