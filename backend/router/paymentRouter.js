const express = require("express");
const { checkAuth } = require("../middleware/checkAuth");
const { processPayment, sendStripeApiKey } = require("../controller/paymentController");
const router = express.Router();

router.route("/process").post(checkAuth, processPayment);

router.route("/stripeapikey").get(checkAuth, sendStripeApiKey);

module.exports = router;
