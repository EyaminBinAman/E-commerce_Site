const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../../middleware/auth.middleware.js");
const {
  getBrands,
  createBrand,
  updateBrandBySlug,
  deleteBrandBySlug,
  toggleBrandActiveBySlug,
} = require("../../controllers/v1/brandController.js");

router.get("/get-brands", getBrands);
router.post("/create-brand", protect, adminOnly, createBrand);
router.patch("/update-brand/:slug", protect, adminOnly, updateBrandBySlug);
router.delete("/delete-brand/:slug", protect, adminOnly, deleteBrandBySlug);
router.patch("/active-on-off-brand/:slug", protect, adminOnly, toggleBrandActiveBySlug);

module.exports = router;
