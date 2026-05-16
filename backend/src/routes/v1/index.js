const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes.js");
const animalRoutes = require("./animalRoutes.js");


router.use("/users", userRoutes);
router.use("/animals", animalRoutes);

module.exports = router;
