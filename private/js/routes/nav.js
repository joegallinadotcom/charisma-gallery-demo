const express = require("express");
const path = require("path");
const router = express.Router();

// Environmental obfuscation
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

// Script Imports
const pool = require("../scripts/db");

// Navigation
router.get("/api/nav/:id", async (req, res) => {
  const currentId = parseInt(req.params.id, 10);
  if (isNaN(currentId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const [prevRows] = await pool.query(process.env.SEARCH_PREV, [currentId]);
    const [nextRows] = await pool.query(process.env.SEARCH_NEXT, [currentId]);

    res.json({
      prev: prevRows[0]?.id || null,
      next: nextRows[0]?.id || null,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
