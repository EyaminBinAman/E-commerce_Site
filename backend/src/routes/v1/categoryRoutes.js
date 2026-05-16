const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../../middleware/auth.middleware.js");
const { createImageUpload } = require("../../utils/upload.js");

const {
  getCategories,
  postCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
} = require("../../controllers/v1/categoryController.js");

const categoryImageUpload = createImageUpload({
  folder: "categories",
  maxSizeKB: 500,
});

// Public + user + admin
router.get("/get-categories", getCategories);

// Admin only
router.post(
  "/post-category",
  protect,
  adminOnly,
  categoryImageUpload.single("image"),
  postCategory
);

router.patch(
  "/update-category/:id",
  protect,
  adminOnly,
  categoryImageUpload.single("image"),
  updateCategory
);

router.delete("/delete-category/:id", protect, adminOnly, deleteCategory);

router.patch(
  "/active-on-off-animals/:id",
  protect,
  adminOnly,
  toggleCategoryActive
);

module.exports = router;