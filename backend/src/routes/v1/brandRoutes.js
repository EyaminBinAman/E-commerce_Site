const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../../middleware/auth.middleware.js");
const { createImageUpload } = require("../../utils/upload.js");
const {
  getBrands,
  createBrand,
  updateBrandBySlug,
  deleteBrandBySlug,
  toggleBrandActiveBySlug,
} = require("../../controllers/v1/brandController.js");

const brandImageUpload = createImageUpload({
  folder: "brands",
  maxSizeKB: 4096,
});

router.get("/get-brands", getBrands);
router.post(
  "/create-brand",
  protect,
  adminOnly,
  brandImageUpload.single("image"),
  createBrand
);
router.patch(
  "/update-brand/:slug",
  protect,
  adminOnly,
  brandImageUpload.single("image"),
  updateBrandBySlug
);
router.delete("/delete-brand/:slug", protect, adminOnly, deleteBrandBySlug);
router.patch("/active-on-off-brand/:slug", protect, adminOnly, toggleBrandActiveBySlug);

module.exports = router;
