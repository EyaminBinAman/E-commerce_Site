"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardShell, { Badge } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import { adminApi } from "@/lib/adminApi";

export default function DeliveryPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi("/orders/get-orders")
      .then((data) => {
        setOrders(data.data?.orders || []);
      })
      .catch((error) => {
        showToast({
          tone: "danger",
          title: error.message || "Failed to load orders.",
        });
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  const summary = useMemo(() => {
    const pending = orders.filter((order) => order.orderStatus === "Pending").length;
    const processing = orders.filter((order) => order.orderStatus === "Processing").length;
    const shipping = orders.filter((order) => order.orderStatus === "Shipping").length;
    const delivered = orders.filter((order) => order.orderStatus === "Delivered").length;
    return { pending, processing, shipping, delivered, total: orders.length };
  }, [orders]);

  const visibleOrders = useMemo(() => {
    return orders.filter((order) =>
      ["Pending", "Processing", "Shipping"].includes(order.orderStatus)
    );
  }, [orders]);

  return (
    <DashboardShell activeItem="Delivery">
      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
          Orders
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
          Delivery
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          Live delivery queue derived from backend order statuses.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Metric title="Pending" value={summary.pending} />
        <Metric title="Processing" value={summary.processing} />
        <Metric title="Shipping" value={summary.shipping} />
        <Metric title="Delivered" value={summary.delivered} />
        <Metric title="Total Orders" value={summary.total} />
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
        <div className="border-b border-neutral-100 px-5 py-4">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
            Delivery queue
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-mainSoft/30">
              <tr className="border-b border-neutral-100 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm font-semibold text-slate-500">
                    Loading deliveries...
                  </td>
                </tr>
              ) : visibleOrders.length ? (
                visibleOrders.map((order) => (
                  <tr key={order._id} className="border-b border-neutral-100 last:border-b-0">
                    <td className="px-4 py-4">
                      <p className="text-sm font-black text-main">{order.orderNumber}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-black text-slate-700">{order.userInfo?.name || "Unknown"}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {order.userInfo?.phone || ""}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                      {order.shippingAddress?.address || order.shippingAddress?.city || "No address"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge tone={order.orderStatus === "Shipping" ? "blue" : "yellow"}>
                        {order.orderStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-black text-slate-700">
                      ৳ {Number(order.grandTotal || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm font-semibold text-slate-500">
                    No delivery orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

function Metric({ title, value }) {
  return (
    <article className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-md shadow-main/5 ring-1 ring-main/15">
      <div className="mb-2 h-1.5 rounded-full bg-gradient-to-r from-main to-main/70" />
      <p className="text-sm font-extrabold text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-black text-main">{value}</p>
    </article>
  );
}
