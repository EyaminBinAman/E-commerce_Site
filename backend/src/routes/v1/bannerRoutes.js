const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../../middleware/auth.middleware.js");
const {
  getBanners,
  postBanner,
  updateBanner,
  deleteBanner,
  toggleBannerActive,
} = require("../../controllers/v1/bannerController.js");

router.get("/get-banners", getBanners);
router.post("/post-banners", protect, adminOnly, postBanner);
router.patch("/update-banners/:id", protect, adminOnly, updateBanner);
router.delete("/delete-banners/:id", protect, adminOnly, deleteBanner);
router.patch("/active-on-off-banners/:id", protect, adminOnly, toggleBannerActive);

module.exports = router;
