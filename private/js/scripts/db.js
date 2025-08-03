const mysql = require("mysql2/promise");

// MySQL Pool Config
const pool = mysql.createPool(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
  console.log("server.js:  Connected to the database.")
);

module.exports = pool;
