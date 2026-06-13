"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardShell, { Badge } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import { adminApi } from "@/lib/adminApi";

function formatMoney(value = 0) {
  return `৳ ${Number(value || 0).toLocaleString()}`;
}

export default function SalesReportPage() {
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
    const totalRevenue = orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    const paidRevenue = orders
      .filter((order) => order.paymentStatus === "Paid")
      .reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    const dueRevenue = orders
      .filter((order) => order.paymentStatus !== "Paid")
      .reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    const deliveryRevenue = orders.reduce((sum, order) => sum + (order.deliveryCharge || 0), 0);
    return {
      totalOrders: orders.length,
      totalRevenue,
      paidRevenue,
      dueRevenue,
      deliveryRevenue,
      averageOrder: orders.length ? totalRevenue / orders.length : 0,
    };
  }, [orders]);

  return (
    <DashboardShell activeItem="Sales Report">
      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
          Orders
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
          Sales Report
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          Live totals derived from backend orders.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Metric title="Total Orders" value={summary.totalOrders} />
        <Metric title="Total Revenue" value={formatMoney(summary.totalRevenue)} />
        <Metric title="Paid Revenue" value={formatMoney(summary.paidRevenue)} />
        <Metric title="Due Revenue" value={formatMoney(summary.dueRevenue)} />
        <Metric title="Delivery Revenue" value={formatMoney(summary.deliveryRevenue)} />
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
        <div className="border-b border-neutral-100 px-5 py-4">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
            Revenue overview
          </p>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard label="Average order" value={formatMoney(summary.averageOrder)} />
          <InfoCard label="Paid orders" value={orders.filter((order) => order.paymentStatus === "Paid").length} />
          <InfoCard label="Pending payments" value={orders.filter((order) => order.paymentStatus !== "Paid").length} />
          <InfoCard label="Cancelled orders" value={orders.filter((order) => order.orderStatus === "Cancelled").length} />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
        <div className="border-b border-neutral-100 px-5 py-4">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
            Recent orders
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-mainSoft/30">
              <tr className="border-b border-neutral-100 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3 text-center">Payment</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm font-semibold text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length ? (
                orders.map((order) => (
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
                        {order.userInfo?.email || ""}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm font-black text-slate-700">
                      {formatMoney(order.grandTotal)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge tone={order.paymentStatus === "Paid" ? "green" : "yellow"}>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge tone={order.orderStatus === "Delivered" ? "green" : order.orderStatus === "Cancelled" ? "gray" : "blue"}>
                        {order.orderStatus}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm font-semibold text-slate-500">
                    No orders found.
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

function InfoCard({ label, value }) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-main">{value}</p>
    </article>
  );
}
