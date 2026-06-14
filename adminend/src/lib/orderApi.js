import { getApiBaseUrl } from "@/lib/apiBaseUrl";

const REQUEST_TIMEOUT_MS = 12000;

const paymentMethodLabels = {
  COD: "Cash on delivery",
  BKASH: "bKash",
  NAGAD: "Nagad",
  CARD: "Card",
  SSL_COMMERZ: "SSLCommerz",
};

export const orderStatusOptions = [
  "Pending",
  "Processing",
  "Shipping",
  "Delivered",
  "Cancelled",
];

export const paymentStatusOptions = [
  { label: "Unpaid", value: "Pending" },
  { label: "Paid", value: "Paid" },
];

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { credentials: "include", ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

export const formatTk = (amount) => {
  const value = Number(amount) || 0;
  return `Tk ${value.toLocaleString("en-US")}`;
};

export const formatOrderDate = (date) => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
};

export const toUiOrderStatus = (status) => {
  if (status === "Shipped") return "Shipping";
  if (status === "Confirmed") return "Processing";
  return status;
};

export const toBackendOrderStatus = (status) => {
  if (status === "Shipping") return "Shipped";
  return status;
};

const formatAddress = (shippingAddress = {}) => {
  const parts = [
    shippingAddress.address,
    shippingAddress.area,
    shippingAddress.city,
  ].filter(Boolean);
  return parts.join(", ") || "—";
};

const mapOrderItem = (item, index) => {
  const unitPrice = Number(item.unitPrice) || 0;
  const finalUnitPrice = Number(item.finalUnitPrice) || unitPrice;
  const discount = Math.max(0, unitPrice - finalUnitPrice);
  const productId = item.product?.toString?.() || "product";
  const variantId = item.variantId?.toString?.() || "default";

  return {
    key: `${productId}-${variantId}-${index}`,
    name: item.productName,
    sku: productId.slice(-8).toUpperCase() || "—",
    quantity: `${item.quantity}`,
    price: formatTk(unitPrice),
    discount: formatTk(discount),
    discountedPrice: formatTk(finalUnitPrice),
    total: formatTk(item.itemSubtotal),
  };
};

export const mapBackendOrderToAdminRow = (order) => {
  const paymentStatus = order.paymentStatus || "Pending";
  const billStatus = paymentStatus === "Paid" ? "Paid" : "Due";

  return {
    id: order.orderNumber,
    mongoId: order._id,
    customer: order.userInfo?.name || "—",
    email: order.userInfo?.email || "",
    phone: order.userInfo?.phone || "",
    date: formatOrderDate(order.createdAt),
    payment: paymentMethodLabels[order.paymentMethod] || order.paymentMethod,
    paymentStatus: paymentStatus.toUpperCase(),
    subtotal: formatTk(order.subtotal),
    discount: formatTk(order.promoDiscount || 0),
    delivery: formatTk(order.deliveryCharge || 0),
    total: formatTk(order.grandTotal),
    orderStatus: toUiOrderStatus(order.orderStatus),
    billStatus,
    address: formatAddress(order.shippingAddress),
    city: order.shippingAddress?.city || "",
    notes: order.adminNote || order.cancelledReason || "",
    items: (order.items || []).map(mapOrderItem),
    modalItems: (order.items || []).map((item, index) => [
      item.productName,
      `${item.quantity}`,
      formatTk(item.itemSubtotal),
      `${item.product?.toString?.() || "product"}-${item.variantId?.toString?.() || "default"}-${index}`,
    ]),
  };
};

export const filterOrdersByMode = (rows, mode = "all") => {
  const isPaid = (order) =>
    order.billStatus === "Paid" || order.paymentStatus === "PAID";
  const isCancelled = (order) => order.orderStatus === "Cancelled";

  if (mode === "active") {
    return rows.filter((order) => !isPaid(order) && !isCancelled(order));
  }

  if (mode === "history") {
    return rows.filter((order) => isPaid(order) || isCancelled(order));
  }

  return rows;
};

export async function getOrdersFromApi() {
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetchWithTimeout(`${apiBaseUrl}/orders/get-orders`, {
    cache: "no-store",
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load orders");
  }

  return (data.data?.orders || []).map(mapBackendOrderToAdminRow);
}

export async function getOrderByIdFromApi(orderId) {
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetchWithTimeout(`${apiBaseUrl}/orders/get-order/${orderId}`, {
    cache: "no-store",
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load order");
  }

  return mapBackendOrderToAdminRow(data.data.order);
}

export async function updateOrderOnApi(orderId, payload = {}) {
  const apiBaseUrl = getApiBaseUrl();
  const body = {};

  if (payload.orderStatus !== undefined) {
    body.orderStatus = toBackendOrderStatus(payload.orderStatus);
  }

  if (payload.paymentStatus !== undefined) {
    body.paymentStatus = payload.paymentStatus;
  }

  const response = await fetchWithTimeout(`${apiBaseUrl}/orders/update-order/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to update order");
  }

  return mapBackendOrderToAdminRow(data.data.order);
}

export async function updateOrderStatusOnApi(orderId, uiStatus) {
  return updateOrderOnApi(orderId, { orderStatus: uiStatus });
}

export async function updateOrderPaymentStatusOnApi(orderId, paymentStatus) {
  return updateOrderOnApi(orderId, { paymentStatus });
}
