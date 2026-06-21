"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import { adminApi } from "@/lib/adminApi";
import {
  getDeliveryZonesFromApi,
  updateDeliveryZonesOnApi,
} from "@/lib/deliveryApi";

export default function DeliveryPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState({
    insideDhakaCharge: 60,
    outsideDhakaCharge: 120,
    freeDeliveryThreshold: 500,
  });
  const [zoneForm, setZoneForm] = useState({
    insideDhakaCharge: "60",
    outsideDhakaCharge: "120",
    freeDeliveryThreshold: "500",
  });
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [isSavingZones, setIsSavingZones] = useState(false);

  useEffect(() => {
    Promise.all([
      adminApi("/orders/get-orders"),
      getDeliveryZonesFromApi().catch(() => null),
    ])
      .then(([ordersData, zoneData]) => {
        setOrders(ordersData.data?.orders || []);
        if (zoneData) {
          setZones(zoneData);
        }
      })
      .catch((error) => {
        showToast({
          tone: "danger",
          title: error.message || "Failed to load delivery data.",
        });
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  const openZoneModal = () => {
    setZoneForm({
      insideDhakaCharge: String(zones.insideDhakaCharge ?? 60),
      outsideDhakaCharge: String(zones.outsideDhakaCharge ?? 120),
      freeDeliveryThreshold: String(zones.freeDeliveryThreshold ?? 500),
    });
    setIsZoneModalOpen(true);
  };

  const handleZoneFormChange = (event) => {
    const { name, value } = event.target;
    setZoneForm((current) => ({ ...current, [name]: value }));
  };

  const handleSaveZones = async (event) => {
    event.preventDefault();
    setIsSavingZones(true);

    try {
      const updated = await updateDeliveryZonesOnApi({
        insideDhakaCharge: Number(zoneForm.insideDhakaCharge),
        outsideDhakaCharge: Number(zoneForm.outsideDhakaCharge),
        freeDeliveryThreshold: Number(zoneForm.freeDeliveryThreshold),
      });
      setZones(updated);
      setIsZoneModalOpen(false);
      showToast({
        tone: "success",
        title: "Delivery zone charges updated.",
      });
    } catch (error) {
      showToast({
        tone: "danger",
        title: error.message || "Could not update delivery zones.",
      });
    } finally {
      setIsSavingZones(false);
    }
  };

  const summary = useMemo(() => {
    const pending = orders.filter((order) => order.orderStatus === "Pending").length;
    const shipping = orders.filter((order) => order.orderStatus === "Shipping").length;
    const delivered = orders.filter((order) => order.orderStatus === "Delivered").length;
    const inTransit = shipping;
    const collected = orders
      .filter((order) => order.paymentStatus === "Paid")
      .reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    const pendingPayment = orders
      .filter((order) => order.paymentStatus !== "Paid")
      .reduce((sum, order) => sum + (order.grandTotal || 0), 0);

    return {
      pending,
      shipping,
      delivered,
      inTransit,
      collected,
      pendingPayment,
      total: orders.length,
    };
  }, [orders]);

  const visibleOrders = useMemo(() => {
    return orders.filter((order) =>
      ["Shipping"].includes(order.orderStatus)
    );
  }, [orders]);

  return (
    <DashboardShell activeItem="Delivery">
      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
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
          <button
            type="button"
            onClick={openZoneModal}
            className="inline-flex h-11 items-center justify-center rounded-full bg-main px-5 text-sm font-black text-white transition hover:bg-main/90"
          >
            Set Delivery Zone
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <InfoCard
          label="Inside Dhaka"
          value={`৳ ${Number(zones.insideDhakaCharge || 0).toLocaleString()}`}
        />
        <InfoCard
          label="Outside Dhaka"
          value={`৳ ${Number(zones.outsideDhakaCharge || 0).toLocaleString()}`}
        />
        <InfoCard
          label="Free delivery over"
          value={`৳ ${Number(zones.freeDeliveryThreshold || 0).toLocaleString()}`}
        />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Metric title="Pending" value={summary.pending} />
        <Metric title="Shipping" value={summary.shipping} />
        <Metric title="Delivered" value={summary.delivered} />
        <Metric title="Total Orders" value={summary.total} />
      </div>

      <div className="mt-5 rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
        <div className="border-b border-neutral-100 px-5 py-4">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
            Delivery overview
          </p>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard label="Orders in transit" value={summary.inTransit} />
          <InfoCard label="Paid revenue" value={`৳ ${Number(summary.collected || 0).toLocaleString()}`} />
          <InfoCard label="Pending payment" value={`৳ ${Number(summary.pendingPayment || 0).toLocaleString()}`} />
          <InfoCard label="Ready to ship" value={summary.pending} />
        </div>
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
                      <p className="text-sm font-black text-slate-700">
                        {order.shippingAddress?.name || order.userInfo?.name || "Unknown"}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {order.shippingAddress?.phone || order.userInfo?.phone || ""}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                      {[
                        order.shippingAddress?.address,
                        order.shippingAddress?.area,
                        order.shippingAddress?.city,
                      ]
                        .filter(Boolean)
                        .join(", ") || "No address"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge tone="blue">
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

      {isZoneModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
          <section className="w-full max-w-lg overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-main/70">
                  Delivery zones
                </p>
                <h2 className="mt-2 text-2xl font-black text-main">Set delivery charges</h2>
              </div>
              <button
                type="button"
                aria-label="Close delivery zone settings"
                onClick={() => setIsZoneModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-slate-500 transition hover:bg-mainSoft hover:text-main"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveZones} className="space-y-4 p-6">
              <ZoneField
                label="Inside Dhaka charge"
                name="insideDhakaCharge"
                value={zoneForm.insideDhakaCharge}
                onChange={handleZoneFormChange}
              />
              <ZoneField
                label="Outside Dhaka charge"
                name="outsideDhakaCharge"
                value={zoneForm.outsideDhakaCharge}
                onChange={handleZoneFormChange}
              />
              <ZoneField
                label="Free delivery threshold"
                name="freeDeliveryThreshold"
                value={zoneForm.freeDeliveryThreshold}
                onChange={handleZoneFormChange}
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsZoneModalOpen(false)}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-neutral-200 px-5 text-sm font-black text-main transition hover:bg-mainSoft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingZones}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-main px-5 text-sm font-black text-white transition hover:bg-main/90 disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  {isSavingZones ? "Saving..." : "Save charges"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
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

function ZoneField({ label, name, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-main/75">
        {label}
      </span>
      <input
        name={name}
        type="number"
        min="0"
        step="1"
        required
        value={value}
        onChange={onChange}
        className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-main"
      />
    </label>
  );
}
