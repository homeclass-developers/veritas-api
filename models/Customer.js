const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    cus_first_name: {
      type: String,
      required: true,
    },
    cus_last_name: {
      type: String,
      required: true,
    },
    cus_email: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: Number,
      default: Math.floor(Math.random()*900000) + 100000
    },
    cus_phone: {
      type: String,
      required: true,
    },
    cus_password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customers", CustomerSchema);
