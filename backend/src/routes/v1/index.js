const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes.js");
const brandRoutes = require("./brandRoutes");
const orderRoutes = require("./orderRoutes");


router.use("/users", userRoutes);
router.use("/brands", brandRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
