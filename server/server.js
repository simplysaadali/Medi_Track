require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

/**
 * TASK 1.4 - Middleware order matters. Everything below must be registered
 * ABOVE the routes, or req.body / req.cookies will be undefined.
 *
 *   app.use(express.json());       // fills req.body
 *   app.use(cookieParser());       // fills req.cookies
 *   app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
 *
 * origin must be the exact Vite URL. "*" silently kills cookies.
 */
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(mongoSanitize());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authLimiter, require("./routes/auth"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/staff", require("./routes/staff"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection failed:", err.message));
