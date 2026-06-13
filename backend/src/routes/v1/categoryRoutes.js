const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategoryBySlug,
  deleteCategoryBySlug,
  toggleCategoryActiveBySlug,
} = require("../../controllers/v1/categoryController.js");

// Public
router.get("/get-categories", getCategories);
router.post("/create-category", createCategory);
router.patch("/update-category/:slug", updateCategoryBySlug);
router.delete("/delete-category/:slug", deleteCategoryBySlug);
router.patch("/active-on-off-animals/:slug", toggleCategoryActiveBySlug);

module.exports = router;