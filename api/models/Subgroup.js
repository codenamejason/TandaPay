// NOTE: This is just a placeholder for now and will likely be rewritten soon

const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const subgroupSchema = new Schema({
    name: String,
    leader: ObjectId,
    isLock: Boolean,
    members: [
        {
            id: ObjectId,
            name: String,
        },
    ],
});

module.exports = subgroupSchema;
