const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../../middleware/auth.middleware.js");
const { createImageUpload } = require("../../utils/upload.js");
const {
  getCategories,
  createCategory,
  updateCategoryBySlug,
  deleteCategoryBySlug,
  toggleCategoryActiveBySlug,
} = require("../../controllers/v1/categoryController.js");

const categoryImageUpload = createImageUpload({
  folder: "categories",
  maxSizeKB: 4096,
});

router.get("/get-categories", getCategories);
router.post(
  "/create-category",
  protect,
  adminOnly,
  categoryImageUpload.single("image"),
  createCategory
);
router.patch(
  "/update-category/:slug",
  protect,
  adminOnly,
  categoryImageUpload.single("image"),
  updateCategoryBySlug
);
router.delete("/delete-category/:slug", protect, adminOnly, deleteCategoryBySlug);
router.patch(
  "/active-on-off-animals/:slug",
  protect,
  adminOnly,
  toggleCategoryActiveBySlug
);

module.exports = router;
