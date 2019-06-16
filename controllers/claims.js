const mongoose = require("mongoose");
const Claim = mongoose.model("claims");

const retrieveClaims = async (req, res, next) => {
    console.log(req.body);
    next();
};

module.exports = {
    retrieveClaims,
};
