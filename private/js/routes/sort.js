const express = require("express");
const path = require("path");
const router = express.Router();

// Environmental obfuscation
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

// Script Imports
const pool = require("../scripts/db");

// Search & Sort
router.get("/api/gallery", async (req, res) => {
  const sql = process.env.SEARCH_ALL;

  try {
    const [output] = await pool.execute(sql);
    res.json({
      message: "Success",
      data: output,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }
});

// Get a single work
router.get("/api/gallerie/by/:id", async (req, res) => {
  const sql = process.env.SEARCH_WORK_ID;
  const params = [req.params.id];

  try {
    const [output] = await pool.execute(sql, params);
    res.json({
      message: "Success",
      output: output,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all works by Type (see Map below)
const typeMap = {
  "newest": process.env.SEARCH_NEWEST,
  "oldest": process.env.SEARCH_OLDEST,
  "updated": process.env.SEARCH_UPDATES,
};

router.get("/api/gallery/by/:type", async (req, res) => {
  const type = req.params.type;
  const sql = typeMap[type];

  if (!sql)
    return res
      .status(400)
      .json({ error: "Invalid request.  Try the buttons above!" });

  try {
    const [output] = await pool.execute(sql, [type]);
    res.json({
      output,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/api/gallery/by/year/:year", async (req, res) => {
  const { year } = req.params;
  const sql = process.env.SEARCH_YEAR_NUM;
  try {
    const [output] = await pool.execute(sql, [year]);
    res.json({ output });
  } catch (err) {
    console.error("Error in /api/gallery/by/year/:year:", err);
    res.status(500).json({ error: "Failed to fetch gallery by year." });
  }
});

router.get("/api/gallery/years", async (req, res) => {
  const sql = process.env.SEARCH_GET_YEARS;
  try {
    const [rows] = await pool.execute(sql);
    const year = rows.map((row) => row.year);
    res.json({ year });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch years" });
  }
});

module.exports = router;
