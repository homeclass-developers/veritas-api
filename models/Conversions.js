const mongoose = require('mongoose');

const ConversionSchema = new mongoose.Schema({
    currency:{
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model("Conversions", ConversionSchema)