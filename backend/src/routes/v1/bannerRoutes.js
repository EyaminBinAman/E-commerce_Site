const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../../middleware/auth.middleware.js");
const { createImageUpload } = require("../../utils/upload.js");
const {
  getBanners,
  postBanner,
  updateBanner,
  deleteBanner,
  toggleBannerActive,
} = require("../../controllers/v1/bannerController.js");

const bannerImageUpload = createImageUpload({
  folder: "banners",
  maxSizeKB: 4096,
});

router.get("/get-banners", getBanners);
router.post(
  "/post-banners",
  protect,
  adminOnly,
  bannerImageUpload.single("image"),
  postBanner
);
router.patch(
  "/update-banners/:id",
  protect,
  adminOnly,
  bannerImageUpload.single("image"),
  updateBanner
);
router.delete("/delete-banners/:id", protect, adminOnly, deleteBanner);
router.patch(
  "/active-on-off-banners/:id",
  protect,
  adminOnly,
  toggleBannerActive
);

module.exports = router;
