const { Pool } = require("pg");
require("dotenv").config();

// Postgresql connection

const pool = new Pool({
  // Create a new pool using the connection details
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on("connect", () => {
  console.log("connected to the db");
});

const query = (text, params) => pool.query(text, params); // Export the query method for passing queries to the pool

module.exports = {
  query,
};
