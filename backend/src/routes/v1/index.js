const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes.js");
const animalRoutes = require("./animalRoutes.js");
const promoCodeRoutes = require("./promoCodeRoutes.js");
const bannerRoutes = require("./bannerRoutes.js");


router.use("/users", userRoutes);
router.use("/animals", animalRoutes);
router.use("/promo-codes", promoCodeRoutes);
router.use("/banners", bannerRoutes);

module.exports = router;
