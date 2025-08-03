const express = require("express");
const path = require("path");
const router = express.Router();

// Environmental obfuscation
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

// Script Imports
const pool = require("../scripts/db");
const { loginCheck } = require("../../../public/js/utils/helpers.js");

// Search & Sort
router.get("/api/admin/gallery", async (req, res) => {
  const sql = process.env.GET_WORKS;

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

const typeMap = {
  "newest": process.env.ADMIN_NEWEST,
  "oldest": process.env.ADMIN_OLDEST,
  "updated": process.env.ADMIN_UPDATES,
};

router.get("/api/admin/gallery/by/:type", async (req, res) => {
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

router.get("/api/admin/gallery/by/year/:year", async (req, res) => {
  const { year } = req.params;
  const sql = process.env.ADMIN_YEAR_NUM;
  try {
    const [output] = await pool.execute(sql, [year]);
    res.json({ output });
  } catch (err) {
    console.error("Error in /api/gallery/by/year/:year:", err);
    res.status(500).json({ error: "Failed to fetch gallery by year." });
  }
});

router.get("/api/admin/gallery/years", async (req, res) => {
  const sql = process.env.ADMIN_GET_YEARS;
  try {
    const [rows] = await pool.execute(sql);
    const year = rows.map((row) => row.year);
    res.json({ year });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch years" });
  }
});

module.exports = router;
