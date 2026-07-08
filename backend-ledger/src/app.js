require("dotenv").config();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const express = require("express");

// Importing routes
const authRouter = require("./routes/auth.route");
const accountRouter = require("./routes/account.route");

const app = express();

// Middleware
app.use(helmet()); // Always use Helmet before defining routes
app.use(cors());
app.use(cookieParser());

app.use(express.json()); //to parse incoming JSON requests from the client

// Define routes
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);

module.exports = app;
