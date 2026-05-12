const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./src/config/db");
const v1Routes = require("./src/routes/v1");
const { notFound, errorHandler } = require("./src/middleware/error.middleware");

const app = express();
const PORT = Number(process.env.PORT);

const startServer = async () => {
  try {
    await connectDB();
    app.use(
      cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
      })
    );
    app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("/", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Server is running",
      });
    });

    app.use("/api/v1", v1Routes);

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
