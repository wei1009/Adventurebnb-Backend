"use strict";
/** Express app for hotel. */
const express = require("express");
const cors = require("cors");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const hotelRoutes = require("./routes/hotel");
const usersRoutes = require("./routes/users");
const cityRoutes = require("./routes/city");
const planRoutes = require("./routes/plan");
const db = require("./db");
const morgan = require("morgan");
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);
app.use("/auth", authRoutes);
app.use("/hotel", hotelRoutes);
app.use("/users", usersRoutes);
app.use("/city", cityRoutes);
app.use("/plan", planRoutes);

app.get("/hoteldata", async function(req, res, next){
    try {
        const results = await db.query(
              `SELECT code, name, city, state FROM hotel WHERE city is not null ORDER BY state, city, name`);
        return res.json(results.rows);
      }
      catch (err) {
        return next(err);
      }
})

app.get("/hotelcitydata", async function(req, res, next){
  try {
      const results = await db.query(
            `SELECT distinct city, state FROM hotel ORDER BY state, city`);
      return res.json(results.rows);
    }
    catch (err) {
      return next(err);
    }
})

app.get("/hotelzipdata", async function(req, res, next){
  try {
      const results = await db.query(
            `SELECT distinct zip, state FROM hotel WHERE zip is not null ORDER BY zip`);
      return res.json(results.rows);
    }
    catch (err) {
      return next(err);
    }
})

app.get("/cityTest", async function(req, res, next){
  try {
      const results = await db.query(
            `SELECT code FROM hotel where city='HOUSTON'`);
      return res.json(results.rows);
    }
    catch (err) {
      return next(err);
    }
})

module.exports = app;
