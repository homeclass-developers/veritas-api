const mongoose = require('mongoose')

const CouponSchema = new mongoose.Schema({
    couponCode:{
        type: String,
        required: true
    },
    couponValue:{
        type: Number,
        required: true
    },
    couponValidity:{
        type: Boolean,
        default: true
    }
},{timestamps: true})

module.exports = mongoose.model("Coupons", CouponSchema)