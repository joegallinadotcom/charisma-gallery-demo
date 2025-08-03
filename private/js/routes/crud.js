const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

// Environmental obfuscation
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

// Script Imports
const pool = require("../scripts/db.js");
const {
  loginCheck,
  refreshSession,
} = require("../../../public/js/utils/helpers.js");
const { modalDialog } = require("../../../public/js/utils/modal.js");

// Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) =>
//     cb(null, path.join(__dirname, "..", "..", "..", "public", "gallery")),
//   filename: (req, file, cb) => {
//     const newfilename =
//       req.timestamp +
//       "_" +
//       file.fieldname +
//       "_" +
//       path.basename(file.originalname);
//     cb(null, newfilename);
//   },
// });

// const upload = multer({ storage });

// CRUD
// Get all works
router.get("/api/gallery/all", async (req, res) => {
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

// Get a single work
router.get("/api/gallery/:id", async (req, res) => {
  const sql = process.env.GET_WORKS_ID;
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

// Create a new work
// router.post(
//   "/api/gallery/new",
//   upload.fields([
//     { name: "primary", maxCount: 1 },
//     { name: "detail", maxCount: 5 },
//   ]),
//   async (req, res) => {
//     const primary = req.files.primary?.[0].filename;
//     const detail = req.files.detail?.map((file) => file.filename);
//     const detailNames = JSON.stringify(detail);

//     const sql = process.env.POST_WORKS;
//     const params = [
//       req.body.year,
//       req.body.display,
//       req.body.display_order,
//       req.body.title,
//       req.body.medium,
//       req.body.dimensions,
//       req.body.statement,
//       primary,
//       detailNames,
//     ];

//     try {
//       const [output] = await pool.execute(sql, params);
//       res.json({
//         message: "Success",
//         data: output,
//       });
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   }
// );

// Update existing work
// router.put("/api/gallery/:id", async (req, res) => {
//   const sql = process.env.PUT_WORKS;
//   const params = [
//     req.body.year,
//     req.body.display,
//     req.body.display_order,
//     req.body.title,
//     req.body.medium,
//     req.body.dimensions,
//     req.body.statement,
//     req.body.id,
//   ];

//   try {
//     const [output] = await pool.execute(sql, params);
//     res.json({
//       message: "Work Updated",
//       changes: output.affectedRows,
//       data: req.body,
//     });
//   } catch (err) {
//     res.status(400).json({ err: err.message });
//   }
// });

// Retrieve image filenames of a single work, and then delete them
// router.post("/api/gallery/image-removal/:id", async (req, res) => {
//   const sql = process.env.DEL_IMAGES;
//   const params = [req.params.id];

//   try {
//     const [output] = await pool.execute(sql, params);
//     if (!output.length) {
//       return res.status(404).json({ error: "Database ID not found." });
//     }

//     const [{ primary_img, detail_img }] = output;
//     const outcome = [];

//     let primaryDeleted;
//     let detailDeleted;

//     if (!primary_img && !detail_img) {
//       return res
//         .status(400)
//         .json({ error: `No filenames returned from database.` });
//     }

//     if (primary_img) {
//       const primaryPath = path.join(
//         __dirname,
//         "..",
//         "..",
//         "..",
//         "public",
//         "gallery",
//         primary_img
//       );
//       try {
//         await fs.unlink(primaryPath);
//         primaryDeleted = true;
//         outcome.push({
//           file: primary_img,
//           status: `Successfully deleted ${primary_img}`,
//         });
//       } catch (err) {
//         primaryDeleted = false;
//         outcome.push({
//           file: primary_img,
//           status: "error",
//           error: err.message,
//         });
//       }
//     }

//     if (detail_img) {
//       let detailNames;
//       try {
//         detailNames = JSON.parse(detail_img);
//       } catch (err) {
//         return res
//           .status(500)
//           .json({ error: "Invalid JSON in 'fullsize' field." });
//       }

//       for (const file of detailNames) {
//         const detailPath = path.join(
//           __dirname,
//           "..",
//           "..",
//           "..",
//           "public",
//           "gallery",
//           file
//         );
//         try {
//           await fs.unlink(detailPath);
//           detailDeleted = true;
//           outcome.push({
//             filepath: detailPath,
//             status: `Successfully deleted ${file}`,
//           });
//         } catch (err) {
//           detailDeleted = false;
//           outcome.push({
//             filepath: detailPath,
//             status: "error",
//             error: err.message,
//           });
//         }
//       }
//     }

//     if (primaryDeleted && detailDeleted) {
//       return res.json({ message: "Success", id: params, outcome });
//     } else {
//       return res.status(500).json({
//         message: "One or both files could not be removed.",
//         id: params,
//         outcome,
//       });
//     }
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// Delete a single work
// router.delete("/api/gallery/:id", async (req, res) => {
//   const sql = process.env.DEL_WORKS_ID;
//   const params = [req.params.id];

//   try {
//     const [output] = await pool.execute(sql, params);
//     res.json({
//       message: "Success",
//       data: output,
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

module.exports = router;
