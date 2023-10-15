"use strict";
/* ---------------
    EXPRESS - Personnel API
-------------------------------- */

const express = require("express");
const app = express();

/*------------------------------------------------*/
// Required Modules:

// envVariables to process.env
require("dotenv").config();
const PORT = process.env?.PORT || 8000;

// asyncErros to errorHandler:
require("express-async-errors");

/*------------------------------------------------*/
// Configrations:

// Connect to DB:
const { dbConnection } = require("./src/config/dbConnection");
dbConnection();
/*------------------------------------------------*/
// Middlewares:

// Accept JSON:
app.use(express.json());

// SessionsCookies:
app.use(require("cookie-session", { secret: process.env.SECRET_KEY }));

// res.getModelList():
app.use(require("./src/middlewares/findSearchSortPage"));

/*------------------------------------------------*/
// Routes:

// HomePath:
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to PERSONNEL API",
  });
});
/*------------------------------------------------*/
// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, () => console.log("http://127.0.0.1:" + PORT));

/*------------------------------------------------*/
