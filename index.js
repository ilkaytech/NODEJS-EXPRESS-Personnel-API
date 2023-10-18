"use strict";
/* ---------------
    EXPRESS - Personnel API
-------------------------------- */

const express = require("express");
const app = express();

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require("dotenv").config();
const PORT = process.env?.PORT || 8000;

// asyncErrors to errorHandler:
require("express-async-errors");

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require("./src/config/dbConnection");
dbConnection();

/* ------------------------------------------------------- */
// Middlewares:

// Loogging:
const morgan = require("morgan");
// console.log(morgan);
// app.use(morgan("tiny"));

// //? write logs to file
// const fs = require("node:fs");
// app.use(
//   morgan("combined", {
//     stream: fs.createWriteStream("./accsess.log", { flags: "a" }),
//   })
// );

//? write logs to file
const fs = require("node:fs");
const now = new Date();
const today = now.toISOString().split("T")[0];
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(`./logs/${today}.log`, { flags: "a" }),
  })
);

// Accept JSON:
app.use(express.json());

// SessionsCookies:
app.use(require("cookie-session")({ secret: process.env.SECRET_KEY }));

// res.getModelList():
app.use(require("./src/middlewares/findSearchSortPage"));

// Cookie: Login/Logout Control Middleware
// app.use(async (req, res, next) => {
//   const Personnel = require("./src/models/personnel.model");

//   req.isLogin = false;

//   if (req.session?.id) {
//     const user = await Personnel.findOne({ _id: req.session.id });

//     // if (user && user.password == req.session.password) {
//     //     req.isLogin = true
//     // }
//     req.isLogin = user && user.password == req.session.password;
//   }
//   console.log("isLogin: ", req.isLogin);

//   next();
// });

// JWT
// const jwt = require("jsonwebtoken");
// app.use(async (req, res, next) => {
//   const auth = req.headers?.authorization || null; // get Authorization
//   const accessToken = auth ? auth.split("")[1] : null; // get JWT

//   req.isLogin = false;

//   jwt.verify(accessToken, process.env.ACCESS_KEY, function (err, user) {
//     if (err) {
//       req.user = null;
//       console.log("JWT Login: NO");
//     } else {
//       (req.isLogin = true), (req.user = user);
//       // (req.user = user.isActive ? user : null);
//       console.log("JWT Login YES");
//     }
//   });

//   next();
// });
app.use(require("./src/middlewares/authenticated"));
/* ------------------------------------------------------- */
// Routes:

// HomePath:
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to PERSONNEL API",
    // session: req.session,
    isLogin: req.isLogin,
    user: req.user,
  });
});

// /auth
app.use("/auth", require("./src/routes/aut.router"));

// /departments
app.use("/departments", require("./src/routes/department.router"));

// /personnels
app.use("/personnels", require("./src/routes/personnel.router"));

/* ------------------------------------------------------- */

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, () => console.log("http://127.0.0.1:" + PORT));

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require("./src/helpers/sync")();
