"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import {
  filterOrdersByMode,
  getOrdersFromApi,
  orderStatusOptions,
  updateOrderStatusOnApi,
} from "@/lib/orderApi";

const summaryCards = [
  {
    title: "All Orders",
    value: "00",
    description: "All paid-delivered and cancelled order records.",
    accent: "from-main to-main/70",
    ring: "ring-main/15",
  },
  {
    title: "Completed Orders",
    value: "00",
    description: "Delivered orders whose payment is fully cleared.",
    accent: "from-emerald-400 to-teal-300",
    ring: "ring-emerald-100",
  },
  {
    title: "Cancelled Orders",
    value: "00",
    description: "Orders cancelled before completion.",
    accent: "from-accent to-accentSoft",
    ring: "ring-accent/20",
  },
  {
    title: "Delivered Orders",
    value: "00",
    description: "All delivered orders whose payment is cleared.",
    accent: "from-mainHover to-main",
    ring: "ring-main/20",
  },
];

export const orderDashboardSummaryCards = [
  {
    title: "Total Orders",
    value: "00",
    description: "All orders currently recorded in the system.",
    accent: "from-cyan-400 to-sky-300",
    ring: "ring-cyan-100",
  },
  {
    title: "Processing Orders",
    value: "00",
    description: "Orders currently being prepared.",
    accent: "from-violet-500 to-fuchsia-300",
    ring: "ring-violet-100",
  },
  {
    title: "Shipping Orders",
    value: "00",
    description: "Orders already shipped out for delivery.",
    accent: "from-indigo-500 to-cyan-300",
    ring: "ring-indigo-100",
  },
  {
    title: "Pending Orders",
    value: "00",
    description: "New orders still waiting for action.",
    accent: "from-slate-500 to-slate-300",
    ring: "ring-slate-100",
  },
  {
    title: "Due Orders",
    value: "00",
    description: "Orders whose payment has not been cleared yet.",
    accent: "from-rose-500 via-orange-400 to-accent",
    ring: "ring-orange-100",
  },
];

function orderStatusTone(status) {
  const tones = {
    Pending: "yellow",
    Processing: "blue",
    Shipping: "blue",
    Delivered: "green",
    Cancelled: "gray",
  };

  return tones[status] || "gray";
}

function formatCount(value) {
  return String(value).padStart(2, "0");
}

function getOrderDashboardCards(orderRows) {
  const countByStatus = (status) =>
    orderRows.filter((order) => order.orderStatus === status).length;
  const dueOrders = orderRows.filter(
    (order) =>
      order.billStatus === "Due" ||
      order.billStatus === "Pending" ||
      order.paymentStatus === "PENDING"
  ).length;

  return orderDashboardSummaryCards.map((card) => {
    const values = {
      "Total Orders": orderRows.length,
      "Processing Orders": countByStatus("Processing"),
      "Shipping Orders": countByStatus("Shipping"),
      "Pending Orders": countByStatus("Pending"),
      "Due Orders": dueOrders,
    };

    return {
      ...card,
      value: formatCount(values[card.title] || 0),
    };
  });
}

function getHistorySummaryCards(orderRows) {
  const delivered = orderRows.filter((order) => order.orderStatus === "Delivered").length;
  const cancelled = orderRows.filter((order) => order.orderStatus === "Cancelled").length;
  const completed = orderRows.filter(
    (order) => order.orderStatus === "Delivered" && order.billStatus === "Paid"
  ).length;

  return summaryCards.map((card) => {
    const values = {
      "All Orders": orderRows.length,
      "Completed Orders": completed,
      "Cancelled Orders": cancelled,
      "Delivered Orders": delivered,
    };

    return {
      ...card,
      value: formatCount(values[card.title] || 0),
    };
  });
}

function OrderDetailsModal({ order, onClose }) {
  if (!order) {
    return null;
  }

  const modalItems = order.modalItems || [];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-main/70">
              Order Details
            </p>
            <h2 className="mt-2 text-2xl font-black text-main">{order.id}</h2>
          </div>
          <button
            type="button"
            aria-label="Close order details"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-slate-500 transition hover:bg-mainSoft hover:text-main"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-88px)] overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-mainSoft/60 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-main/70">
                Customer
              </p>
              <p className="mt-3 text-sm font-black text-slate-800">{order.customer}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">{order.phone}</p>
            </div>
            <div className="rounded-2xl bg-mainSoft/60 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-main/70">
                Payment
              </p>
              <p className="mt-3 text-sm font-black text-slate-800">{order.payment}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">{order.paymentStatus}</p>
            </div>
            <div className="rounded-2xl bg-mainSoft/60 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-main/70">
                Delivery
              </p>
              <p className="mt-3 text-sm font-black text-slate-800">{order.date}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">{order.address}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge tone={order.orderStatus === "Delivered" ? "green" : order.orderStatus === "Cancelled" ? "gray" : "blue"}>
              {order.orderStatus}
            </Badge>
            <Badge tone={order.billStatus === "Paid" ? "green" : "yellow"}>
              {order.billStatus}
            </Badge>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-mainSoft/50">
                <tr className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Quantity</th>
                  <th className="px-5 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {modalItems.map(([name, quantity, total, lineKey]) => (
                  <tr key={lineKey} className="border-t border-neutral-100">
                    <td className="px-5 py-4 text-sm font-black text-slate-800">{name}</td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-500">{quantity}</td>
                    <td className="px-5 py-4 text-right text-sm font-black text-slate-800">{total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ml-auto mt-6 w-full max-w-sm space-y-3 rounded-2xl bg-slate-50 p-5">
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Subtotal</span>
              <span>{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Delivery</span>
              <span>{order.delivery}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-3 text-lg font-black text-main">
              <span>Total</span>
              <span>{order.total}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function OrderHistoryDashboard({
  activeItem = "Order History",
  heading = "Order History",
  rowFilter = "all",
  editableStatus = false,
  viewBasePath = "",
}) {
  const { showToast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [allOrderRows, setAllOrderRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const orderRows = useMemo(
    () => filterOrdersByMode(allOrderRows, rowFilter),
    [allOrderRows, rowFilter]
  );

  const filteredRows = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return orderRows;

    return orderRows.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.payment.toLowerCase().includes(query) ||
        order.orderStatus.toLowerCase().includes(query) ||
        order.billStatus.toLowerCase().includes(query)
    );
  }, [orderRows, searchText]);

  const displayCards = editableStatus
    ? getOrderDashboardCards(orderRows)
    : getHistorySummaryCards(orderRows);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const rows = await getOrdersFromApi();
        setAllOrderRows(rows);
      } catch (error) {
        showToast({
          tone: "danger",
          title: "Failed to load orders.",
          description: error.message || "Please check backend server.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  async function handleOrderStatusChange(order, nextStatus) {
    try {
      const updated = await updateOrderStatusOnApi(order.mongoId, nextStatus);
      setAllOrderRows((currentRows) =>
        currentRows.map((row) => (row.mongoId === order.mongoId ? updated : row))
      );
      setSelectedOrder((currentOrder) =>
        currentOrder?.mongoId === order.mongoId ? updated : currentOrder
      );
      showToast({
        tone: "success",
        title: `Order ${order.id} updated to ${nextStatus}.`,
      });
    } catch (error) {
      showToast({
        tone: "danger",
        title: error.message || "Failed to update order status.",
      });
    }
  }

  return (
    <DashboardShell activeItem={activeItem}>
      <div className="rounded-[28px] border border-neutral-200 bg-white px-6 py-7 shadow-lg shadow-main/5 md:px-8">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">Orders</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-main md:text-4xl">{heading}</h1>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-slate-400 md:text-base">
          Review paid-and-delivered orders and cancelled orders, then open any record for full details.
        </p>

        <label className="mt-7 flex h-14 items-center rounded-2xl border border-neutral-200 bg-white px-5 text-slate-400 shadow-inner shadow-main/5">
          <Icon name="search" className="h-5 w-5" />
          <input
            type="search"
            aria-label="Search order history"
            placeholder="Search by order ID, customer, payment, or status..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="ml-3 w-full bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {displayCards.map((card) => (
          <article key={card.title} className={`relative min-h-40 overflow-hidden rounded-[24px] border border-neutral-200 bg-white p-6 shadow-lg shadow-main/5 ring-1 ${card.ring}`}>
            <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.accent}`} />
            <p className="text-sm font-extrabold text-slate-500">{card.title}</p>
            <p className="mt-5 text-3xl font-black tracking-tight text-slate-950">{card.value}</p>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-400">{card.description}</p>
          </article>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500">
          Loading orders...
        </div>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead className="bg-white">
              <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-[0.3em] text-slate-300">
                <th className="px-14 py-6">Order ID</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6 text-center">Payment</th>
                <th className="px-8 py-6">Total</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((order) => (
                <tr key={order.mongoId} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-14 py-7 text-sm font-black text-slate-700">{order.id}</td>
                  <td className="px-8 py-7">
                    <p className="text-sm font-black text-slate-700">{order.customer}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-400">{order.date}</p>
                  </td>
                  <td className="px-8 py-7 text-center">
                    <p className="text-sm font-semibold text-slate-500">{order.payment}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.25em] text-slate-400">{order.paymentStatus}</p>
                  </td>
                  <td className="px-8 py-7 text-sm font-black text-slate-800">{order.total}</td>
                  <td className="px-8 py-7">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <Badge tone={orderStatusTone(order.orderStatus)}>{order.orderStatus}</Badge>
                        <Badge tone={order.billStatus === "Paid" ? "green" : "yellow"}>{order.billStatus}</Badge>
                      </div>
                      {editableStatus ? (
                        <select
                          aria-label={`Update status for ${order.id}`}
                          value={order.orderStatus}
                          onChange={(event) =>
                            handleOrderStatusChange(order, event.target.value)
                          }
                          className="h-9 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-black text-main outline-none transition focus:border-main"
                        >
                          {orderStatusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-10 py-7 text-center">
                    {viewBasePath ? (
                      <Link
                        href={`${viewBasePath}/${order.mongoId}`}
                        className="inline-flex h-11 items-center rounded-2xl bg-main px-6 text-sm font-black text-white shadow-md shadow-main/20 transition hover:bg-mainHover"
                      >
                        View
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="h-11 rounded-2xl bg-main px-6 text-sm font-black text-white shadow-md shadow-main/20 transition hover:bg-mainHover"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-10 text-center text-sm font-semibold text-slate-400">
                    No orders found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </DashboardShell>
  );
}
