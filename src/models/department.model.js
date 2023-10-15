"use strict";
/* ---------------
    EXPRESS - Personnel API
-------------------------------- */
const { mongoose } = require("../config/dbConnection");
/* --------------------------------*/

const DepartmenSchema = new mongoose.Schema(
  {
    name: String,
    trim: true,
    required: true,
    unique: true,
  },
  {
    collection: "departments, timestamps:true",
  }
);
/* --------------------------------*/
module.exports = mongoose.model("Department", DepartmentsSchema);
