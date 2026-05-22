const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth.middleware.js");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../../controllers/v1/cartController.js");

router.get("/get-cart", protect, getCart);
router.post("/add-to-cart", protect, addToCart);
router.patch("/update-cart-item/:itemId", protect, updateCartItem);
router.delete("/remove-cart-item/:itemId", protect, removeCartItem);
router.delete("/clear-cart", protect, clearCart);

module.exports = router;
