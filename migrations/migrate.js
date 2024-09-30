const { query } = require("../config/db");
const fs = require("fs");
const path = require("path");

// Read sql file

const sql = fs.readFileSync(path.join(__dirname, "init.sql")).toString();

// Run the sql query

(async () => {
  try {
    await query(sql);
    console.log("Database migrated successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  }
})();
