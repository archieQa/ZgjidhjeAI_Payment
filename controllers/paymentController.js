const { query } = require("../config/db");
const { processPayment } = require("../services/cardProcessingService");
const { body, validationResult } = require("express-validator");

// Handle the payment process

const makePayment = [
  // Validation middleware

  body("cardDetails.cardNumber")
    .isLength({ min: 16, max: 16 })
    .withMessage("Card number must be 16 digits"),
  body("cardDetails.cvv")
    .isLength({ min: 3, max: 3 })
    .withMessage("CVV must be 3 digits"),
  body("paymentMethod")
    .isIn(["VISA", "PayPal"])
    .withMessage("Invalid payment method"),

  // Actual Payment Logic

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, cardDetails, planName, paymentMethod } = req.body;

    try {
      console.log("Starting payment process for user:", userId);

      // Get the selected Plan
      const planResult = await query("SELECT * FROM plans WHERE name = $1", [
        planName,
      ]);
      if (planResult.rows.length === 0) {
        throw new Error("Invalid plan name");
      }
      const plan = planResult.rows[0];
      console.log("Plan retrieved:", plan);

      // Process the payment
      const paymentResult = processPayment(plan.price, paymentMethod);
      if (paymentResult.status !== "success") {
        throw new Error("Payment processing failed");
      }
      console.log("Payment processed successfully");

      // Update the user subscription in the database
      await query("UPDATE users SET plan = $1, token = $2 WHERE id = $3", [
        plan.name,
        plan.tokens_per_day || null,
        userId,
      ]);
      console.log("User subscription updated");

      // Record the transaction
      await query(
        "INSERT INTO transactions (user_id, amount, status, payment_method) VALUES ($1, $2, $3, $4)",
        [userId, plan.price, "completed", paymentMethod]
      );
      console.log("Transaction recorded");

      res.json({
        message: "Payment successful",
        transactionId: paymentResult.TransactionID,
      });
    } catch (error) {
      console.error("Error during payment processing:", error);
      res
        .status(400)
        .json({ error: error.message || "An unknown error occurred" });
    }
  },
];

module.exports = { makePayment };
