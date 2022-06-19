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
    packageType:{
        type: String,
        required: true
    },
    country: {
      type: String,
      required: true,
    },
    amount1: {
      type: Number,
      required: true,
    },
    currency1: {
      type: String,
      required: true,
    },
    currentRateUsed1: {
      type: String,
      default: "",
    },
    amount1Paid: {
      type: Number,
      default: null,
    },

    amount1Remaining: {
      type: Number,
    },

    amount1Status: {
      type: Number,
      default: 0, // 0 for not paid, 1 for awaiting approval for part payment, 2 for confirmed for part payment, 3 for not paid balanc e, 4, for awaiting approval for full payment, 5 for confirmed for all
    },

    amount2: {
      type: Number,
    },
    currency2: {
      type: String,
    },
    currentRateUsed2: {
      type: String,
      default: "",
    },
    amount2Paid: {
      type: Number,
      default: null,
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
    familyCurrency: {
      type: String,
    },
    familyCurrencyRate: {
      type: String,
      default: "",
    },
    familyAmountPaid: {
      type: Number,
      default: null,
    },

    familyAmountRemaining: {
      type: Number,
    },

    familyPaymentStatus: {
      type: Number,
      default: 0, // 0 for not paid, 1 for awaiting approval for part payment, 2 for confirmed for part payment, 3 for not paid balanc e, 4, for awaiting approval for full payment, 5 for confirmed for all
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Applications", ApplicationSchema);
