const applicationRouter = require("express").Router();
const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../controllers/auth");
const { sendEmailNotification } = require("../controllers/notifications");
const Applications = require("../models/Applications");
const Customer = require("../models/Customer");
const Packages = require("../models/Packages");

applicationRouter.post(
  "/create-veritas-application",
  verifyToken,
  asyncHandler((req, res) => {
    const {
      customerId,
      serviceName,
      packageId,
      numberOfPayment,
      processingTime,
      country,
      packageType,
      familyPaymentAllowed,
      amount1,
      currency1,
      amount2,
      currency2,
      familyPayment,
      familyIndividualPayment,
      familyCurrency,
    } = req.body;

    Applications.findOne({ customerId, packageId, serviceName }).then(
      (isExist) => {
        if (isExist) {
          return res
            .status(422)
            .json({ invalid: "Visa Application Already in existence" });
        } else {
          // Get number of valid applications number
          const validApplication = Applications.find({
            amount1Status: { $gte: 2 },
          }).count();

          //Get the number of slot, compare it with validapplication, perform logic, then save
          Packages.findOne({ _id: packageId }).then((package) => {
            if (package) {
              const slot = package.slot;
              //check if slot is equal to valid application
              if (slot == validApplication) {
                return res.status(422).json({
                  invalid:
                    "No slots available for this visa Package. Please try again another time",
                });
              } else {
                // save the application

                new Applications({
                  customerId,
                  serviceName,
                  packageId,
                  numberOfPayment,
                  processingTime,
                  country,
                  packageType,
                  familyPaymentAllowed,
                  amount1,
                  currency1,
                  amount1Remaining: amount1,
                  amount2,
                  currency2,
                  amount2Remaining: amount2,
                  familyPayment,
                  familyIndividualPayment,
                  familyCurrency,
                  familyAmountRemaining: familyPayment,
                })
                  .save()
                  .then((application) => {
                    if (application) {
                      // send email to customer

                      Customer.findOne({ customerId }).then((customer) => {
                        const subject = "Veritas Application";
                        const message = `An email content`;

                        sendEmailNotification(
                          customer.cus_email,
                          subject,
                          message
                        );
                        return res.status(200).json({
                          success:
                            "Visa Application saved successfully... Please note that your payment(s) validates slot",
                          application,
                        });
                      });
                    }
                  });
              }
            } else {
              return res
                .status(422)
                .json({ invalid: "Visa Package no longer available" });
            }
          });
        }
      }
    );
  })
);

//fetch veritas application

applicationRouter.post(
  "/fetch-veritas-application",
  verifyToken,
  asyncHandler((req, res) => {
    const { customerId } = req.body;

    Applications.find({ customerId }).then((application) => {
      return res.status(200).json({ application });
    });
  })
);

module.exports = { applicationRouter };
