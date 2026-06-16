const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const app = express();
dotenv.config();

const connectDB = require("./src/config/db");
const Routes = require("./src/routes/index.js");
const { notFound, errorHandler } = require("./src/middleware/error.middleware");

const PORT = Number(process.env.PORT || 3000);
const defaultAllowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3002",
];
const envOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  process.env.CLIENTEND_URL,
  process.env.ADMINEND_URL,
  process.env.CLIENT_URLS,
]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((value) => value.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envOrigins])];

const isLocalDevOrigin = (origin) => {
  try {
    const parsed = new URL(origin);
    return (
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "0.0.0.0" ||
      parsed.hostname.startsWith("192.168.") ||
      parsed.hostname.startsWith("10.") ||
      parsed.hostname.startsWith("172.")
    );
  } catch {
    return false;
  }
};

const startServer = async () => {
  try {
    await connectDB();
    app.use(
      cors({
        origin(origin, callback) {
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
            return callback(null, true);
          }
          return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
      })
    );
    app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    app.get("/", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Server is running",
      });
    });

    app.use("/api", Routes);

    app.use(notFound);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
