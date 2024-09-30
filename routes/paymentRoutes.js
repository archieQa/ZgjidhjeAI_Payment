const express = require("express");
const router = express.Router();
const { makePayment } = require("../controllers/paymentController");

// Handle the payment process Router
router.post("/pay", makePayment);

module.exports = router;
