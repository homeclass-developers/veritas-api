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
      numberOfFamily,
      country,
      packageType,
      familyPaymentAllowed,
      amount1,
      depositAllowed1,
      amount1ToPay,
      amount1Remaining,
      currency1,
      amount2,
      depositAllowed2,
      amount2ToPay,
      amount2Remaining,
      currency2,
      familyPayment,
      familyDepositAllowed,
      familyAmountToPay,
      familyAmountRemaining,
      familyIndividualPayment,
      familyCurrency,
    } = req.body;

    Applications.findOne({ customerId, packageId, serviceName }).then(
      (isExist) => {
        if (isExist) {
          return res.status(422).json({
            invalid:
              "You have already applied for this package. Please ensure you make payment if you have not done so. Payment validates slot",
          });
        } else {
          //Get the number of slot, compare it with valid application, perform logic, then save
          Packages.findOne({ _id: packageId }).then((package) => {
            if (package) {
              Applications.countDocuments(
                { serviceName, amount1Status: { $gte: 2 } },
                function (err, count) {
                  if (err) {
                    console.log(err);
                    return res
                      .status(500)
                      .json({ invalid: "System error encountered" });
                  } else {
                    const slot = package.slot;
                    //check if slot is equal to valid application
                    if (slot == count) {
                      sendEmailNotification(
                        "sales@homeclassgroup.com",
                        `${serviceName} Slots filled up and customers are applying`,
                        `This is to inform you that ${serviceName} slots is filled up and custosmer are trying to book.  Consider expanding the slots `
                      );
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
                        depositAllowed1,
                        amount1ToPay,
                        numberOfFamily,
                        amount1Remaining,
                        currency1,
                        amount1Remaining,
                        amount2,
                        depositAllowed2,
                        amount2ToPay,
                        amount2Remaining,
                        currency2,
                        amount2Remaining,
                        familyPayment,
                        familyDepositAllowed,
                        familyAmountToPay,
                        familyAmountRemaining,
                        familyIndividualPayment,
                        familyCurrency,
                      })
                        .save()
                        .then((application) => {
                          if (application) {
                            // send email to customer

                            Customer.findOne({ customerId }).then(
                              (customer) => {
                                const subject = "New Veritas Application";
                                const message = `
                        
                          <h4>Dear ${customer.cus_first_name}</h4>
                          <p>Your Veritas Visa Application package(${application.serviceName}) has been successfully submitted. Please note that 
                            no slot has been booked yet until when payment is made and confirmed. 
                          </p>
                          <p>Kindly Pay into the following account details below <br /.
                              Account Name: UflyRight Enterprises<br />
                              Account Number: 1016335342 <br />
                              Bank Name: Zenith Bank
                          </p>
                          <p>Please note that Payment validates slots <br />
                          Should you need any support or more information, please send us a mail at 
                          support@homeclassgroup.com or call us on the following numbers<br />
                          <ul>
                            <l1>Phone Line 1</li>
                          </ul>

                          </p>
                          <p>Thank You <br />Homeclass Group</p>
                        
                        `;

                                sendEmailNotification(
                                  customer.cus_email,
                                  subject,
                                  message
                                );

                                const adminMsg = `
                                  Dear Team,
                                  <p>${customer.cus_first_name} ${customer.cus_last_name} has just applied for ${application.serviceName}. No Payment has been made and no slots assigned. You may do well to call the customer on ${customer.cus_phone}</p>
                                  <p>Regards<br />Autogenerated from system</p>

                                `;

                                sendEmailNotification(
                                  "sales@homeclassgroup.com",
                                  subject,
                                  adminMsg
                                );
                                return res.status(200).json({
                                  success:
                                    "Visa Application saved successfully... Please note that your payment(s) validates slot",
                                  application,
                                });
                              }
                            );
                          }
                        });
                    }
                  }
                }
              );
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

// upload payment proof

applicationRouter.post(
  "/upload-proof",
  verifyToken,
  asyncHandler((req, res) => {
    const {
      applicationId,
      proofUrl,
      conversionRate,
      customerId,
      amount1Remaining,
      amount2ToPay,
      amount2Remaining,
      familyAmountToPay,
      familyAmountRemaining,
    } = req.body;

    if (!proofUrl) {
      return res.status(422).json({ invalid: "No file selected" });
    } else if (!customerId) {
      return res
        .status(422)
        .json({ invalid: "Please sign in to your account" });
    } else {
      Applications.findByIdAndUpdate(
        applicationId,
        {
          currencyRates: conversionRate,
          proofUrl,
          amount1Status: amount1Remaining === 0 ? 4 : 1,
          amount2Status:
            amount2ToPay === 0 ? 0 : amount2Remaining === 0 ? 4 : 1,
          familyPaymentStatus:
            familyAmountToPay === 0 ? 0 : familyAmountRemaining === 0 ? 4 : 1,
        },
        {
          new: true,
        }
      ).exec((err, result) => {
        if (err) {
          return res.status(500).json({
            invalid: "An error encountered while carrying out the request",
          });
        } else {
          Customer.findOne({ customerId }).then((cus) => {
            if (cus) {
              const subject =
                "Awaiting Payment Confirmation for your Veritas Payment";
              const message = `<h4>Dear ${cus.cus_first_name}</h4>
                <p>We acknowledge the receipt of your payment proof. It will be confirmed within the hour</p>
                <p>Should you need any support or more information, please send us a mail at 
                support@homeclassgroup.com or call us on the following numbers<br />
                <ul>
                  <l1>Phone Line 1</li>
                </ul>

                </p>
                <p>Thank You <br />Homeclass Group</p>
              `;

              sendEmailNotification(cus.cus_email, subject, message);

              const adminMsg = `
              Dear Team,
              <p>${cus.cus_first_name} ${cus.cus_last_name} has just uploaded payment ptoof for ${result.serviceName}. No slots assigned until payment is approved. You may do well to call the customer on ${cus.cus_phone}</p>
              <p>Regards<br />Autogenerated from system</p>

            `;

              sendEmailNotification(
                "sales@homeclassgroup.com",
                subject,
                adminMsg
              );
              return res.status(200).json({
                success: "Payment Proof successfully uploaded",
                result,
              });
            }
          });
        }
      });
    }
  })
);

// Get number of slots

applicationRouter.post(
  "/get-slots",
  verifyToken,
  asyncHandler((req, res) => {
    const { serviceName } = req.body;

    Applications.countDocuments(
      { serviceName, amount1Status: { $gte: 2 } },
      function (err, count) {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).json({ slot: count });
        }
      }
    );
  })
);

// fetch unpaid invoices

applicationRouter.post(
  "/fetch-invoices",
  verifyToken,
  asyncHandler((req, res) => {
    const { customerId } = req.body;

    try {
      Applications.find({
        customerId,
        $and: [
          { amount1Status: 0 },
          { familyPaymentStatus: 0 },
          { amount2Status: 0 },
        ],
      }).then((invoices) => {
        return res.status(200).json({ invoices });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ invalid: "Unable to fetch invoices" });
    }
  })
);


// fetch payments awaiting confirmation and payments due for second payment
applicationRouter.post(
  "/fetch-awaiting-payments",
  verifyToken,
  asyncHandler((req, res) => {
    const { customerId } = req.body;

    try {
      Applications.find({
        customerId,
        $or: [
          { amount1Status: 1 },
          { familyPaymentStatus: 1 },
          { amount2Status: 1 },
          { amount1Status: 4 },
          { familyPaymentStatus: 4 },
          { amount2Status: 4 },
          { amount1Status: 3 },
          { familyPaymentStatus: 3 },
          { amount2Status: 3 },

        ],
      }).then((invoices) => {
        return res.status(200).json({ invoices });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ invalid: "Unable to fetch invoices" });
    }
  })
);

// upload second proof payment

applicationRouter.post(
  "/upload-second-proof",
  verifyToken,
  asyncHandler((req, res) => {
    const {
      applicationId,
      proofUrl,
      conversionRate,
      customerId,
      amount2ToPay,
      familyAmountToPay,
    } = req.body;

    if (!proofUrl) {
      return res.status(422).json({ invalid: "No file selected" });
    } else if (!customerId) {
      return res
        .status(422)
        .json({ invalid: "Please sign in to your account" });
    } else {
      Applications.findByIdAndUpdate(
        applicationId,
        {
          currencyRates2: conversionRate,
          proofUrl2: proofUrl,
          amount1Status: 4,
          amount2Status: amount2ToPay === 0 ? 0 : 4,
          familyPaymentStatus: familyAmountToPay === 0 ? 0 : 4,
        },
        {
          new: true,
        }
      ).exec((err, result) => {
        if (err) {
          return res.status(500).json({
            invalid: "An error encountered while carrying out the request",
          });
        } else {
          Customer.findOne({ customerId }).then((cus) => {
            if (cus) {
              const subject =
                "Awaiting Payment Confirmation for your Veritas Payment";
              const message = `<h4>Dear ${cus.cus_first_name}</h4>
                <p>We acknowledge the receipt of your payment proof. It will be confirmed within the hour</p>
                <p>Should you need any support or more information, please send us a mail at 
                support@homeclassgroup.com or call us on the following numbers<br />
                <ul>
                  <l1>Phone Line 1</li>
                </ul>

                </p>
                <p>Thank You <br />Homeclass Group</p>
              `;

              sendEmailNotification(cus.cus_email, subject, message);
              sendEmailNotification(cus.cus_email, subject, message);

              const adminMsg = `
              Dear Team,
              <p>${cus.cus_first_name} ${cus.cus_last_name} has just uploaded payment ptoof for ${result.serviceName}. No slots assigned until payment is approved. You may do well to call the customer on ${cus.cus_phone}</p>
              <p>Regards<br />Autogenerated from system</p>

            `;

              sendEmailNotification(
                "sales@homeclassgroup.com",
                subject,
                adminMsg
              );

              return res.status(200).json({
                success: "Payment Proof successfully uploaded",
                result,
              });
            }
          });
        }
      });
    }
  })
);

// fetch paid invoices

applicationRouter.post(
  "/fetch-payments",
  verifyToken,
  asyncHandler((req, res) => {
    const { customerId } = req.body;

    try {
      Applications.find({
        customerId,
        $and: [
          { amount1Status: 5 },
          { amount2Status: 5 },
          { familyPaymentStatus: 5 }
        ],
      }).then((payments) => {
        return res.status(200).json({ payments });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ invalid: "Unable to fetch Payments" });
    }
  })
);

module.exports = { applicationRouter };
