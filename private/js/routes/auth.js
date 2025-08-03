const express = require("express");
const path = require("path");
const router = express.Router();
const session = require("express-session");
const bcrypt = require("bcrypt");

// Environmental obfuscation
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

// Script Imports
const pool = require("../scripts/db");
const {
  refreshSession,
  redirect,
} = require("../../../public/js/utils/helpers");

// Register / Login / Logout / Verify
// router.post("/auth/register", async (req, res) => {
//   const { un, pw } = req.body;
//   const sql = process.env.LOOKUP;
//   const reg = process.env.REG;

//   if (!un || !pw) {
//     return res.status(400).json({ message: "Both fields are required" });
//   }

//   try {
//     const [results] = await pool.execute(sql, [un]);
//     const hashedPw = await bcrypt.hash(pw, 10);

//     await pool.execute(reg, [un, hashedPw]);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.post("/auth/login", redirect, async (req, res) => {
//   const { un, pw } = req.body;
//   const sql = process.env.LOOKUP;

//   try {
//     const [output] = await pool.execute(sql, [un]);

//     const results = output[0];
//     if (!results) {
//       return res.status(401).json({ message: "Authentication failure" });
//     }

//     const match = await bcrypt.compare(pw, results.pw);
//     if (!match) {
//       return res.status(401).json({ message: "Authentication failure" });
//     }

//     req.session.userId = results.un;
//     res.sendStatus(200);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/auth/logout", (req, res) => {
  // req.session.destroy((err) => {
  //   if (err) {
  //     return res.status(500).json({ message: "Logout failed" });
  //   }

  //   res.clearCookie("connect.sid");
  res.redirect(
    `http://joegallina.com/portfolio/charisma${process.env.SECRET1}logout.html`
  );
  // });
});

// router.get("/auth/verify", refreshSession, (req, res) => {
//   if (req.session && req.session.userId) {
//     res.json({ loggedIn: true });
//   } else {
//     res.json({ loggedIn: false });
//   }
// });

module.exports = router;
