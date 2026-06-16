const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../../middleware/auth.middleware.js");

const {
  getCategories,
  createCategory,
  updateCategoryBySlug,
  deleteCategoryBySlug,
  toggleCategoryActiveBySlug,
} = require("../../controllers/v1/categoryController.js");

// Public
router.get("/get-categories", getCategories);

// Admin only
router.post("/create-category", protect, adminOnly, createCategory);
router.patch("/update-category/:slug", protect, adminOnly, updateCategoryBySlug);
router.delete("/delete-category/:slug", protect, adminOnly, deleteCategoryBySlug);
router.patch(
  "/active-on-off-animals/:slug",
  protect,
  adminOnly,
  toggleCategoryActiveBySlug
);

module.exports = router;