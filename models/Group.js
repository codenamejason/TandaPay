// NOTE: This is just a placeholder for now and will likely be rewritten soon

const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const groupSchema = new Schema({
    members: [ObjectId],
});

groupSchema.pre("save", function(next) {
    var user = this;

    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

module.exports = mongoose.model("groups", groupSchema);
