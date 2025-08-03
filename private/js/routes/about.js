const express = require("express");
const path = require("path");
const router = express.Router();

// Environmental obfuscation
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

// Script Imports
const pool = require("../scripts/db");
const { refreshSession } = require("../../../public/js/utils/helpers");

// About Routes (Public and Admin)
router.get("/api/about/get", async (req, res) => {
  const sql = process.env.GET_ABOUT;

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

// router.put("/api/about/save", async (req, res) => {
//   const sql = process.env.PUT_ABOUT;
//   const { content } = req.body;
//   const type = "about";

//   try {
//     const [output] = await pool.execute(sql, [content, type]);
//     res.json({
//       message: "Success",
//       data: output,
//     });
//   } catch (err) {
//     res.status(400).json({ err: err.message });
//   }
// });

module.exports = router;
