const express = require("express");
const router = express.Router();

const { protect, admin } = require("../../middleware/auth.middleware");
const {
  validateCreateOrder,
  validateOrderIdentifier,
  validateUpdateOrder,
  validateUpdateOrderStatus,
  validateUpdatePaymentStatus,
  validateRefundOrder,
} = require("../../middleware/order.validation.middleware");
const orderController = require("../../controllers/v1/orderController");

router.post("/", protect, validateCreateOrder, orderController.createOrder);

router.get("/my-orders", protect, orderController.getMyOrders);

router.get("/:id", protect, validateOrderIdentifier, orderController.getSingleOrder);

router.get("/", protect, admin, orderController.getOrders);

router.patch(
  "/:id",
  protect,
  admin,
  validateOrderIdentifier,
  validateUpdateOrder,
  orderController.updateOrder
);

router.patch(
  "/:id/status",
  protect,
  admin,
  validateOrderIdentifier,
  validateUpdateOrderStatus,
  orderController.updateOrderStatus
);

router.patch(
  "/:id/payment-status",
  protect,
  admin,
  validateOrderIdentifier,
  validateUpdatePaymentStatus,
  orderController.updatePaymentStatus
);

router.patch(
  "/:id/refund",
  protect,
  admin,
  validateOrderIdentifier,
  validateRefundOrder,
  orderController.refundOrder
);

router.delete(
  "/:id",
  protect,
  admin,
  validateOrderIdentifier,
  orderController.softDeleteOrder
);

module.exports = router;
