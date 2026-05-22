const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes.js");
const brandRoutes = require("./brandRoutes.js");
const orderRoutes = require("./orderRoutes");
const categoryRoutes = require("./categoryRoutes.js");
const productRoutes = require("./productRoutes.js");
const animalRoutes = require("./animalRoutes.js");
const cartRoutes = require("./cartRoutes.js");

router.use("/users", userRoutes);
router.use("/brands", brandRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/animals", animalRoutes);
router.use("/cart", cartRoutes);

module.exports = router;
