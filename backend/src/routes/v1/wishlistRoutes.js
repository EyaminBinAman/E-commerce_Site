const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth.middleware.js");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../../controllers/v1/wishlistController.js");

router.get("/get-wishlist", protect, getWishlist);
router.post("/add-to-wishlist", protect, addToWishlist);
router.delete("/remove-wishlist-item/:productId", protect, removeFromWishlist);
router.delete("/clear-wishlist", protect, clearWishlist);

module.exports = router;
