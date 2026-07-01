require("dotenv").config();
const express = require("express");
const authRouter = require("./routes/auth.route");
const app = express();
app.use(express.json()); //to parse incoming JSON requests from the client
app.use("/api/auth", authRouter);

module.exports = app;
