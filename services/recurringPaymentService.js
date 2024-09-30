const { query } = require("../config/db");
const { processPayment } = require("./cardProcessingService");

// Process monthly recurring payments for users

const processRecurringPayment = async () => {
  try {
    // Get all users on monthly plans
    const result = await query(
      "SELECT id, email, plan FROM users WHERE plan != $1 AND subscription_status = $2",
      ["free", "active"]
    );

    // Process payment for each user
    for (const user of result.rows) {
      const planResult = await query(
        "SELECT price FROM plans WHERE name = $1",
        [user.plan]
      );
      const plan = planResult.rows[0];

      if (plan && plan.price) {
        // Simulate payment (you would replace this with actual payment logic)
        const paymentResult = processPayment(plan.price, "VISA"); // Default to VISA for now

        if (paymentResult.status === "success") {
          // Record Transaction
          await query(
            "INSERT INTO transactions (user_id, amount, status, payment_method) VALUES ($1, $2, $3, $4)",
            [user.id, plan.price, "completed", "VISA"]
          );
          console.log(`Payment successful for user ${user.email}`);
        }
      } else {
        console.error(`Payment failed for user ${user.email}`);
      }
    }
  } catch (error) {
    console.error("Error during recurring payments:", error);
  }
};

module.exports = {
  processRecurringPayment,
};
