// NOTE: This is just a placeholder for now and will likely be rewritten soon

const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const paymentSchema = new Schema({
    amount: String,
    date: Date,
    method: String,
    refunded: Boolean,
    transactionID: String,
    paymentAddress: String,
});

module.exports = paymentSchema;
