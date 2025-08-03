// Package Activations
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const PORT = process.env.PORT || 3002;
const bodyParser = require("body-parser");
const path = require("path");
const { setTimeout } = require("timers/promises");

const app = express();

// Environmental obfuscation
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

// Script Imports
const pool = require("./scripts/db.js");
const timestamp = require("../../public/js/utils/timestamp.js");

// Route, API, and Utils Imports
const static = require("./routes/static.js");
const auth = require("./routes/auth.js");
const sort = require("./routes/sort.js");
const sortAdmin = require("./routes/sort-admin.js");
const about = require("./routes/about.js");
const crud = require("./routes/crud.js");
const nav = require("./routes/nav.js");

// Session Store
const sessionStore = new MySQLStore({}, pool);

app.use(
  session({
    secret: process.env.SESS,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400000,
    },
  })
);

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(timestamp);
app.use("/", static);
app.use("/", auth);
app.use("/", sort);
app.use("/", sortAdmin);
app.use("/", about);
app.use("/", crud);
app.use("/", nav);
app.use(express.static(path.join(__dirname, "..", "..", "public")));

// // Default response for any other request (Not Found)
app.use((req, res) => {
  res.sendStatus(404).end();
});

app.listen(PORT, () => {
  console.log(`server.js:  Express.js server running on port ${PORT}`);
});
