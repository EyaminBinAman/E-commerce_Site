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
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

const startServer = async () => {
  try {
    await connectDB();
    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
          }

          return callback(new Error("Not allowed by CORS"));
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
