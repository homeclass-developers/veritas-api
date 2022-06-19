const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  processingTime: {
    type: String,
    required: true,
  },

  numberOfPayment: {
    type: Number,
    required: true,
  },
  packageType: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  slot: {
    type: Number,
    required: true,
  },
  familyAllowed: {
    type: String,
    required: true,
  },
  amount1: {
    type: Number,
    required: true,
  },
  amountToBeDeposited1: {
    type: Number,
  },
  currency1: {
    type: String,
    required: true,
  },
  amount2: {
    type: Number,
  },
  amountToBeDeposited2: {
    type: Number,
  },
  currency2: {
    type: String,
  },
  familyPayment: {
    type: Number,
  },
  familyCurrency: {
    type: String,
  },
  familyAmountToBeDeposited: {
    type: Number,
  },
  paymentRequiredForFamily: {
    type: Boolean,
    
  },
  depositAllowed1: {
    type: Boolean,
    
  },
  depositAllowed2: {
    type: Boolean,
    
  },
  familyDepositAllowed: {
    type: Boolean,
    
  },
  familyIndividualPayment: {
    type: Boolean,
    
  },
  availability:{
    type: Boolean,
    default: true
  }
},{timestamps: true});

module.exports = mongoose.model("Packages", PackageSchema);
