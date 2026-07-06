require("dotenv").config();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const express = require("express");
const authRouter = require("./routes/auth.route");
const app = express();
// Always use Helmet before defining routes
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json()); //to parse incoming JSON requests from the client
app.use("/api/auth", authRouter);

module.exports = app;
