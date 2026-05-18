const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes.js");
const brandRoutes = require("./brandRoutes");
const orderRoutes = require("./orderRoutes");
const categoryRoutes = require("./categoryRoutes.js");
const productRoutes = require("./productRoutes.js");

router.use("/users", userRoutes);
router.use("/brands", brandRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);

module.exports = router;
