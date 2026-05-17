const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes.js");
const categoryRoutes = require("./categoryRoutes.js");
const productRoutes = require("./productRoutes.js");

router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);

module.exports = router;