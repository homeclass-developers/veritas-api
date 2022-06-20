const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    packageId: {
      type: String,
      required: true,
    },
    numberOfPayment: {
      type: Number,
      required: true,
    },
    familyPaymentAllowed: {
      type: Boolean,
      required: true,
    },
    familyIndividualPayment: {
      type: Boolean,
      required: true,
    },
    numberOfFamily: {
      type: Number,
      default: null,
    },
    processingTime: {
      type: String,
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
    amount1: {
      type: Number,
      required: true,
    },
    depositAllowed1: {
      type: Boolean,
      required: true,
    },
    amount1ToPay: {
      type: Number,
      required: true,
    },
    currency1: {
      type: String,
      required: true,
    },

    amount1Remaining: {
      type: Number,
      required: true,
    },

    amount1Status: {
      type: Number,
      default: 0, // 0 for not paid any, 1 for awaiting approval for part payment, 2 for confirmed for part payment, 3 for not paid balance, 4, for awaiting approval for full payment, 5 for confirmed for all
    },

    amount2: {
      type: Number,
    },
    depositAllowed2: {
      type: Boolean,
    },

    currency2: {
      type: String,
    },

    amount2ToPay: {
      type: Number,
    },

    amount2Remaining: {
      type: Number,
    },

    amount2Status: {
      type: Number,
      default: 0, // 0 for not paid, 1 for awaiting approval for part payment, 2 for confirmed for part payment, 3 for not paid balanc e, 4, for awaiting approval for full payment, 5 for confirmed for all
    },
    familyPayment: {
      type: Number,
    },
    familyDepositAllowed: {
      type: Boolean,
    },
    familyCurrency: {
      type: String,
    },
    familyAmountToPay: {
      type: Number,
    },

    familyAmountRemaining: {
      type: Number,
    },

    familyPaymentStatus: {
      type: Number,
      default: 0, // 0 for not paid, 1 for awaiting approval for part payment, 2 for confirmed for part payment, 3 for not paid balanc e, 4, for awaiting approval for full payment, 5 for confirmed for all
    },
    currencyRates:{
      type: Object,
      default:{}
    },
    proofUrl:{
      type: String,
      default:""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Applications", ApplicationSchema);
