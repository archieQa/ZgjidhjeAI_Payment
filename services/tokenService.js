const { query } = require("../config/db");
const moment = require("moment");

// Reset tokens for users on daily plans

const resetTokens = async () => {
  try {
    // Get all users who need tokens reset
    const result = await query(
      "SELECT id, plan, token, next_token_reset FFROM users WHERE plan != $1 AND next_token_reset < NOW()', ['premium']"
    );

    // For each user, reset tokens if applicable
    for (const user of result.rows) {
      // Get the plan details to detirmine the tokens limits
      const planResult = await query(
        "SELECT tokens_per_day * FROM plans WHERE name = $1",
        [user.plan]
      );
      const plan = planResult.rows[0];

      if (plan && plan.tokens_per_day) {
        // Reset tokens to the plans daily limits
        await query(
          " UPDATE users SET token = $1, next_token_reset = $2 WHERE id = $3 ",
          [
            plan.tokens_per_day,
            moment().add(24, "hours").format("YYYY-MM-DD HH:mm:ss"),
            user.id,
          ]
        );
      }
    }
    console.log("Token reset process completed");
  } catch (error) {
    console.error("Error during token reset:", error);
  }
};

module.exports = { resetTokens };
