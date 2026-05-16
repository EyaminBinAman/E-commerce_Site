const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes.js");
const brandRoutes = require("./brandRoutes");


router.use("/users", userRoutes);
router.use("/brands", brandRoutes);

module.exports = router;
