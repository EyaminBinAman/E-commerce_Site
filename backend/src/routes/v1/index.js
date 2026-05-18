const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes.js");
<<<<<<< HEAD
const brandRoutes = require("./brandRoutes");
const orderRoutes = require("./orderRoutes");


router.use("/users", userRoutes);
router.use("/brands", brandRoutes);
router.use("/orders", orderRoutes);
=======
const categoryRoutes = require("./categoryRoutes.js");
const productRoutes = require("./productRoutes.js");

router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
>>>>>>> origin/products_api

module.exports = router;