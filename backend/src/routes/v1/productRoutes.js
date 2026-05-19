const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../../middleware/auth.middleware.js");
const {
  getProducts,
  getDeletedProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/v1/productController.js");

// Public
router.get("/get-products", getProducts);
router.get("/get-product/:slug", getSingleProduct);
router.get("/get-deleted-products",
  protect, adminOnly,
  getDeletedProducts);

// Admin only
router.post("/create-product", 
  protect, adminOnly,
  createProduct);
router.patch("/update-product/:slug", 
  protect, adminOnly,
  updateProduct);
router.delete("/delete-product/:slug", 
  protect, adminOnly,
  deleteProduct);

module.exports = router;
