const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (req, res, next) => {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      metadata: {
        company: "shubla",
      },
    });

    res.status(200).json({ success: true, client_secret: myPayment.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Payment processing failed", error: error.message });
  }
};

exports.sendStripeApiKey = async (req, res, next) => {
  try {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch Stripe API key", error: error.message });
  }
};
