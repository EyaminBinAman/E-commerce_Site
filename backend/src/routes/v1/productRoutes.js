const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../../middleware/auth.middleware.js");
const { createImageUpload } = require("../../utils/upload.js");
const {
  getProducts,
  getDeletedProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/v1/productController.js");

const productImageUpload = createImageUpload({
  folder: "products",
  maxSizeKB: 4096,
});

// Public
router.get("/get-products", getProducts);
router.get("/get-product/:slug", getSingleProduct);
router.get("/get-deleted-products",
  protect, adminOnly,
  getDeletedProducts);

// Admin only
router.post(
  "/create-product",
  protect,
  adminOnly,
  productImageUpload.array("images", 10),
  createProduct
);
router.patch(
  "/update-product/:slug",
  protect,
  adminOnly,
  productImageUpload.array("images", 10),
  updateProduct
);
router.delete("/delete-product/:slug", 
  protect, adminOnly,
  deleteProduct);

module.exports = router;
