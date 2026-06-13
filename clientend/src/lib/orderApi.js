import { getApiBaseUrl } from "@/lib/apiBaseUrl";

const FETCH_TIMEOUT_MS = 8000;

export const toClientOrderStatus = (status) => {
  if (status === "Shipped") return "In Transit";
  if (status === "Confirmed") return "Processing";
  return status || "Pending";
};

const formatOrderDate = (date) => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const normalizeOrderForProfile = (order) => ({
  id: order.orderNumber || order._id,
  date: formatOrderDate(order.createdAt),
  status: order.orderStatus || "Pending",
  displayStatus: toClientOrderStatus(order.orderStatus),
  itemsCount:
    order.items?.reduce((total, item) => total + (Number(item.quantity) || 0), 0) ||
    0,
  total: Number(order.grandTotal) || 0,
  products: order.items?.map((item) => item.productName).filter(Boolean) || [],
});

export async function getMyOrdersFromApi() {
  const response = await fetch(`${getApiBaseUrl()}/orders/my-orders`, {
    cache: "no-store",
    credentials: "include",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load orders");
  }

  const orders = data.data?.orders || data.orders || [];
  return orders.map(normalizeOrderForProfile);
}
