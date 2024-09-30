const express = require("express");
const router = express.Router();
const { makePayment } = require("../controllers/paymentController");
const {
  processRecurringPayment,
} = require("../services/recurringPaymentService");

// Handle the payment process Router
router.post("/pay", makePayment);

router.post("/recurring", async (req, res) => {
  try {
    await processRecurringPayment();
    res.status(200).send("Recurring payment process completed");
  } catch (error) {
    console.error("Error during recurring payments:", error);
    res
      .status(500)
      .send("An error occurred during the recurring payment process");
  }
});

module.exports = router;
