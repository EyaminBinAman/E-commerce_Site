const express = require("express");
const router = express.Router();
const { protect, optionalAuth, admin } = require("../../middleware/auth.middleware");
const {
  validateBrandIdentifier,
  validateCreateBrand,
  validateUpdateBrand,
  validateUpdateBrandStatus,
} = require("../../middleware/brand.validation.middleware");
const brandController = require("../../controllers/v1/brandController");

router.get("/get-brands", optionalAuth, brandController.getBrands);
router.post("/post-brand", protect, admin, validateCreateBrand, brandController.createBrand);
router.patch("/update-brand/:identifier", protect, admin, validateBrandIdentifier, validateUpdateBrand, brandController.updateBrand);
router.delete("/delete-brand/:identifier", protect, admin, validateBrandIdentifier, brandController.softDeleteBrand);
router.patch("/active-brand/:identifier", protect, admin, validateBrandIdentifier, validateUpdateBrandStatus, brandController.updateBrandStatus);

module.exports = router;
