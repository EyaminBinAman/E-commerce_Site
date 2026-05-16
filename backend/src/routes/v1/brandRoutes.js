const express = require("express");
const router = express.Router();
const { protect, admin } = require("../../middleware/auth.middleware");
const brandController = require("../../controllers/v1/brandController");

router.get("/get-brands", brandController.getBrands);
router.post("/post-brand", protect, admin, brandController.createBrand);
router.put("/update-brand/:id", protect, admin, brandController.updateBrand);
router.delete("/delete-brand/:id", protect, admin, brandController.deleteBrand);
router.patch("/active-brand/:id", protect, admin, brandController.toggleBrandStatus);

module.exports = router;
