const express = require("express");
const router = express.Router();
const { query } = require("../config/db");

// Get all plans

router.get("/plans", async (req, res) => {
  try {
    const results = await query("SELECT * FROM plans");
    res.json(results.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plans" });
  }
});

module.exports = router;
