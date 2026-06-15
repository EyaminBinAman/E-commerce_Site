const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../../middleware/auth.middleware.js");
const {
  getReviews,
  postReview,
  replyReview,
  deleteReview,
} = require("../../controllers/v1/reviewController.js");

router.get("/get-reviews", getReviews);
router.post("/post-reviews", protect, postReview);
router.patch("/reply-reviews/:id", protect, adminOnly, replyReview);
router.delete("/delete-reviews/:id", protect, adminOnly, deleteReview);

module.exports = router;
