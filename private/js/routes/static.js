const express = require("express");
const path = require("path");
const router = express.Router();

// Environmental obfuscation
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

const {
  loginCheck,
  refreshSession,
  doNotCache,
  redirect,
} = require("../../../public/js/utils/helpers.js");

// Paths
router.get(process.env.SECRET1, doNotCache, (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      process.env.SECRET1,
      "works.html"
    )
  );
});

// router.get(process.env.SECRET2, redirect, doNotCache, (req, res) => {
//   res.sendFile(
//     path.join(
//       __dirname,
//       "..",
//       "..",
//       "..",
//       "public",
//       process.env.SECRET2,
//       "index.html"
//     )
//   );
// });

router.get(`js/scripts/admin-works.js`, doNotCache, (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "js",
      "scripts",
      "admin-works.js"
    )
  );
});

router.get(`js/scripts/admin-about.js`, doNotCache, (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "js",
      "scripts",
      "admin-about.js"
    )
  );
});

router.get(`css/admin.css`, doNotCache, (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "..", "public", "css", "admin.css")
  );
});

// router.get(`${process.env.SECRET2}register.html`, doNotCache, (req, res) => {
//   res.sendFile(
//     path.join(
//       __dirname,
//       "..",
//       "..",
//       "..",
//       "public",
//       process.env.SECRET2,
//       "register.html"
//     )
//   );
// });

router.get(`${process.env.SECRET1}logout.html`, doNotCache, (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      process.env.SECRET1,
      "logout.html"
    )
  );
});

router.get(`${process.env.SECRET1}about.html`, (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      process.env.SECRET1,
      "about.html"
    )
  );
});

router.get(`${process.env.SECRET1}gallery/by/year/*`, (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      process.env.SECRET1,
      "works.html"
    )
  );
});

router.get(`${process.env.SECRET1}gallery/by/*`, (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      process.env.SECRET1,
      "works.html"
    )
  );
});

router.get(`${process.env.SECRET1}gallery/:id(\\d+)`, (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      process.env.SECRET1,
      "works.html"
    )
  );
});

router.get("/gallery/by/year/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "..", "public", "gallery", "index.html")
  );
});

router.get("/gallery/by/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "..", "public", "gallery", "index.html")
  );
});

router.get("/gallery/:id(\\d+)", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "..", "public", "gallery", "index.html")
  );
});

module.exports = router;
