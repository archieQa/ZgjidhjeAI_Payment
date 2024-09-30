require("dotenv").config();
const express = require("express");
const app = express();
const paymentRoutes = require("./routes/paymentRoutes");
const { resetTokens } = require("./services/tokenService");
const cron = require("node-cron");
const {
  processRecurringPayments,
} = require("./services/recurringPaymentService");

// Schedule the token reset process to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running daily token reset job");
  resetTokens();
});

// Schedule the recurring payment process to run every month on the 1st
cron.schedule("0 0 1 * *", () => {
  console.log("Running monthly recurring payment job");
  processRecurringPayments();
});

// Routes

const userRoutes = require("./routes/userRoutes");

// middleware

app.use(express.json());

// User Routes
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);

// Listen on port

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
