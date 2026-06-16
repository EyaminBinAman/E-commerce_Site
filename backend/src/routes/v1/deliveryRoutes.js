const express = require("express");

const router = express.Router();
const { protect, adminOnly } = require("../../middleware/auth.middleware");
const {
  getDeliveryZones,
  updateDeliveryZones,
} = require("../../controllers/v1/deliveryController");

router.get("/get-zones", getDeliveryZones);
router.patch("/update-zones", protect, adminOnly, updateDeliveryZones);

module.exports = router;
