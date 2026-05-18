const mongoose = require("mongoose");

const Order = require("../../models/Order");

const sendSuccess = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const isAdmin = (user) => {
  return user?.role === "admin";
};

const getProductModel = () => {
  return require("../../models/Product");
};

const toObjectId = (id) => {
  return new mongoose.Types.ObjectId(id);
};

const idsMatch = (left, right) => {
  return left?.toString() === right?.toString();
};

const normalizeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

const getFirstNumber = (...values) => {
  for (const value of values) {
    const number = normalizeNumber(value);

    if (number !== null) {
      return number;
    }
  }

  return null;
};

const getFirstValue = (...values) => {
  return values.find((value) => value !== undefined && value !== null && value !== "");
};

const findVariant = (product, variantId) => {
  if (!variantId) {
    return null;
  }

  const variants = product.variants || product.productVariants || [];

  return variants.find((variant) => {
    return (
      idsMatch(variant._id, variantId) ||
      idsMatch(variant.id, variantId) ||
      idsMatch(variant.variantId, variantId)
    );
  });
};

const getProductImage = (product, variant) => {
  const image = getFirstValue(
    variant?.image,
    variant?.thumbnail,
    Array.isArray(variant?.images) ? variant.images[0] : undefined,
    product.image,
    product.thumbnail,
    Array.isArray(product.images) ? product.images[0] : undefined
  );

  return image?.toString() || "";
};

const getProductName = (product) => {
  return getFirstValue(product.name, product.title, product.productName)?.toString() || "";
};

const getVariantName = (variant) => {
  return getFirstValue(variant?.name, variant?.title, variant?.variantName)?.toString() || null;
};

const getPricingSnapshot = (product, variant) => {
  const unitPrice = getFirstNumber(
    variant?.price,
    variant?.unitPrice,
    variant?.basePrice,
    product.price,
    product.unitPrice,
    product.basePrice,
    product.regularPrice
  );
  const discountedUnitPrice = getFirstNumber(
    variant?.discountedPrice,
    variant?.discountPrice,
    variant?.discountedUnitPrice,
    variant?.salePrice,
    product.discountedPrice,
    product.discountPrice,
    product.discountedUnitPrice,
    product.salePrice
  );

  return {
    unitPrice,
    discountedUnitPrice,
  };
};

const getStock = (product, variant) => {
  return getFirstNumber(variant?.stock, variant?.quantity, product.stock, product.quantity);
};

const getWeight = (product, variant) => {
  const weight = getFirstValue(variant?.weight, product.weight);

  return weight === undefined || weight === null ? null : weight;
};

const generateOrderNumber = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    const orderNumber = `ORD-${timestamp}-${random}`;
    const existingOrder = await Order.findOne({ orderNumber }).setOptions({
      withDeleted: true,
    });

    if (!existingOrder) {
      return orderNumber;
    }
  }

  return `ORD-${new mongoose.Types.ObjectId().toString().toUpperCase()}`;
};

// Promo integration helpers
const calculatePromoDiscount = async ({ promoCode }) => {
  if (!promoCode) {
    return 0;
  }

  // TODO: When Promo is ready, fetch and validate the promo code here.
  // Keep price authority on the backend and return the calculated discount.
  return 0;
};

const createOrder = async (req, res, next) => {
  try {
    const Product = getProductModel();
    const { items, promoCode, paymentMethod, shippingAddress } = req.validatedOrder;
    const productIds = [...new Set(items.map((item) => item.productId))];
    const products = await Product.find({
      _id: { $in: productIds.map(toObjectId) },
      isActive: true,
      isDeleted: { $ne: true },
    });
    const productsById = new Map(
      products.map((product) => [product._id.toString(), product])
    );
    const orderItems = [];
    const warnings = [];

    for (const item of items) {
      const product = productsById.get(item.productId);

      if (!product) {
        return sendError(res, 404, "Product not found");
      }

      const variant = findVariant(product, item.variantId);

      if (item.variantId && !variant) {
        return sendError(res, 404, "Product variant not found");
      }

      const stock = getStock(product, variant);

      if (stock !== null && stock < item.quantity) {
        return sendError(res, 400, "Insufficient product stock");
      }

      const { unitPrice, discountedUnitPrice } = getPricingSnapshot(product, variant);

      if (unitPrice === null) {
        return sendError(res, 400, "Product price is not available");
      }

      const finalUnitPrice =
        discountedUnitPrice !== null ? discountedUnitPrice : unitPrice;
      const itemSubtotal = finalUnitPrice * item.quantity;
      const productName = getProductName(product);
      const image = getProductImage(product, variant);

      if (!productName) {
        return sendError(res, 400, "Product name is not available");
      }

      if (!image) {
        warnings.push(`Product image is not available for ${productName}`);
      }

      orderItems.push({
        product: product._id,
        ...(item.variantId ? { variantId: item.variantId } : {}),
        variantName: getVariantName(variant),
        productName,
        image: image || null,
        quantity: item.quantity,
        weight: getWeight(product, variant),
        unitPrice,
        discountedUnitPrice,
        finalUnitPrice,
        itemSubtotal,
      });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.itemSubtotal, 0);
    const promoDiscount = await calculatePromoDiscount({ promoCode });
    const deliveryCharge = 0;
    const grandTotal = subtotal - promoDiscount + deliveryCharge;
    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      userInfo: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
      items: orderItems,
      subtotal,
      promoCode,
      promoDiscount,
      deliveryCharge,
      grandTotal,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
      shippingAddress,
    });

    return sendSuccess(res, 201, "Order created successfully", {
      order,
      ...(warnings.length > 0 ? { warnings } : {}),
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    return next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) {
      return sendError(res, 403, "Admin access only");
    }

    const orders = await Order.find().sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Orders fetched successfully", { orders });
  } catch (error) {
    return next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Orders fetched successfully", { orders });
  } catch (error) {
    return next(error);
  }
};

const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.orderId);

    if (!order) {
      return sendError(res, 404, "Order not found");
    }

    if (!isAdmin(req.user) && !idsMatch(order.user, req.user._id)) {
      return sendError(res, 403, "You are not allowed to access this order");
    }

    return sendSuccess(res, 200, "Order fetched successfully", { order });
  } catch (error) {
    return next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) {
      return sendError(res, 403, "Admin access only");
    }

    const order = await Order.findById(req.orderId);

    if (!order) {
      return sendError(res, 404, "Order not found");
    }

    order.set(req.validatedOrder);
    await order.save();

    return sendSuccess(res, 200, "Order updated successfully", { order });
  } catch (error) {
    return next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) {
      return sendError(res, 403, "Admin access only");
    }

    const order = await Order.findById(req.orderId);

    if (!order) {
      return sendError(res, 404, "Order not found");
    }

    order.set(req.validatedStatus);
    await order.save();

    return sendSuccess(res, 200, "Order status updated successfully", { order });
  } catch (error) {
    return next(error);
  }
};

const updatePaymentStatus = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) {
      return sendError(res, 403, "Admin access only");
    }

    const order = await Order.findById(req.orderId);

    if (!order) {
      return sendError(res, 404, "Order not found");
    }

    order.set(req.validatedStatus);
    await order.save();

    return sendSuccess(res, 200, "Payment status updated successfully", { order });
  } catch (error) {
    return next(error);
  }
};

const refundOrder = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) {
      return sendError(res, 403, "Admin access only");
    }

    const order = await Order.findById(req.orderId);

    if (!order) {
      return sendError(res, 404, "Order not found");
    }

    if (order.paymentStatus !== "Paid") {
      return sendError(res, 400, "Only paid orders can be refunded");
    }

    if (req.validatedRefund.amount > order.grandTotal) {
      return sendError(res, 400, "Refund amount cannot exceed order total");
    }

    order.set({
      paymentStatus: "Refunded",
      refund: {
        ...req.validatedRefund,
        refundedAt: new Date(),
        refundedBy: req.user._id,
      },
    });
    await order.save();

    return sendSuccess(res, 200, "Order refunded successfully", { order });
  } catch (error) {
    return next(error);
  }
};

const softDeleteOrder = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) {
      return sendError(res, 403, "Admin access only");
    }

    const order = await Order.findById(req.orderId);

    if (!order) {
      return sendError(res, 404, "Order not found");
    }

    order.set({ isDeleted: true });
    await order.save();

    return sendSuccess(res, 200, "Order deleted successfully", { order });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  getSingleOrder,
  updateOrder,
  updateOrderStatus,
  updatePaymentStatus,
  refundOrder,
  softDeleteOrder,
};
