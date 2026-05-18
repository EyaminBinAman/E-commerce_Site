const express = require("express");
const router = express.Router();

const { protect, admin } = require("../../middleware/auth.middleware");
const {
  validateCreateOrder,
  validateOrderIdentifier,
  validateUpdateOrder,
  validateRefundOrder,
} = require("../../middleware/order.validation.middleware");
const orderController = require("../../controllers/v1/orderController");

router.post("/create-order", protect, validateCreateOrder, orderController.createOrder);

router.get("/my-orders", protect, orderController.getMyOrders);

router.get("/get-order/:id", protect, validateOrderIdentifier, orderController.getSingleOrder);

router.get("/get-orders", protect, admin, orderController.getOrders);

router.patch(
  "/update-order/:id",
  protect,
  admin,
  validateOrderIdentifier,
  validateUpdateOrder,
  orderController.updateOrder
);

router.patch(
  "/refund-order/:id",
  protect,
  admin,
  validateOrderIdentifier,
  validateRefundOrder,
  orderController.refundOrder
);

router.delete(
  "/delete-order/:id",
  protect,
  admin,
  validateOrderIdentifier,
  orderController.softDeleteOrder
);

module.exports = router;
