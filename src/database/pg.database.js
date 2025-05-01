require("dotenv").config();
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connect = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to the Database");
    client.release();
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    // Don't crash the app, but log the error
    if (!isProduction) {
      console.error("Connection details:", {
        connectionString: process.env.PG_CONNECTION_STRING
          ? "Set (not showing for security)"
          : "NOT SET",
      });
    }
  }
};

connect();

const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Error executing query:", error.message);
    console.error("Query:", text);
    throw error; // Re-throw so route handlers can catch it
  }
};

module.exports = {
  query,
  pool,
};
