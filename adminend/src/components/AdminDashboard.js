"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import { adminApi } from "@/lib/adminApi";

const formatTk = (value) => `Tk ${Number(value || 0).toLocaleString("en-US")}`;

function HeaderPanel({ stats }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-7 shadow-lg shadow-slate-200/60 md:px-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-main">
            Overview
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-4 max-w-4xl text-sm font-semibold leading-7 text-slate-400 md:text-base">
            Live store data from backend orders, products, users, brands, and categories.
          </p>
        </div>

        <div className="rounded-2xl bg-mainSoft px-5 py-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-main">
            Today
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">{formatTk(stats.todayRevenue)}</p>
        </div>
      </div>
    </div>
  );
}

function RevenuePanel({ weeklyRevenue }) {
  const maxValue = Math.max(...weeklyRevenue.map((item) => item.value), 1);

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-black text-slate-950">Weekly Revenue</p>
          <p className="mt-1 text-sm font-bold text-slate-400">
            Sales movement from paid orders this week
          </p>
        </div>
        <Badge tone="green">{weeklyRevenue.length ? "Live" : "No data"}</Badge>
      </div>

      <div className="mt-8 flex h-72 items-end gap-4 rounded-2xl bg-mainSoft/45 px-4 pb-4 pt-8">
        {weeklyRevenue.map(({ day, value }) => (
          <div key={day} className="flex min-w-0 flex-1 flex-col items-center gap-3">
            <div className="flex h-48 w-full items-end">
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-main to-accent shadow-lg shadow-main/10"
                style={{ height: `${Math.max(8, (value / maxValue) * 100)}%` }}
              />
            </div>
            <p className="text-xs font-black text-slate-500">{day}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityPanel({ stats }) {
  const rows = [
    ["Paid Orders", stats.paidOrders, "w-[68%]", "green"],
    ["Shipping Orders", stats.shippingOrders, "w-[54%]", "blue"],
    ["Low Stock", stats.lowStock, "w-[42%]", "yellow"],
    ["Inactive Brands", stats.inactiveBrands, "w-[30%]", "gray"],
  ];

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <p className="text-lg font-black text-slate-950">Store Health</p>
      <p className="mt-1 text-sm font-bold text-slate-400">
        Current operational snapshot
      </p>

      <div className="mt-7 space-y-5">
        {rows.map(([label, value, width, tone]) => (
          <div key={label}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-slate-700">{label}</p>
              <Badge tone={tone}>{String(value).padStart(2, "0")}</Badge>
            </div>
            <div className="mt-3 h-3 rounded-full bg-slate-100">
              <div className={`h-3 rounded-full bg-main ${width}`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayRevenue: 0,
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    lowStock: 0,
    shippingOrders: 0,
    paidOrders: 0,
    inactiveBrands: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([
    { day: "Mon", value: 0 },
    { day: "Tue", value: 0 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 0 },
    { day: "Fri", value: 0 },
    { day: "Sat", value: 0 },
    { day: "Sun", value: 0 },
  ]);

  useEffect(() => {
    let alive = true;

    async function loadDashboard() {
      try {
        const [ordersData, productsData, brandsData, categoriesData, usersData] =
          await Promise.all([
            adminApi("/orders/get-orders"),
            adminApi("/products/get-products?limit=100"),
            adminApi("/brands/get-brands?includeInactive=true"),
            adminApi("/categories/get-categories?includeInactive=true"),
            adminApi("/users/accounts"),
          ]);

        const orders = ordersData.data?.orders || [];
        const products = productsData.products || [];
        const brands = brandsData.brands || [];
        const categories = categoriesData.categories || [];
        const accounts = usersData.accounts || [];

        const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");
        const shippingOrders = orders.filter((order) => order.orderStatus === "Shipping");
        const lowStockProducts = products
          .filter((product) => Number(product.stockQuantity || 0) <= 10)
          .slice(0, 3);

        const today = new Date();
        const todayKey = today.toDateString();
        const revenueByDay = new Map(
          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => [day, 0])
        );

        paidOrders.forEach((order) => {
          const orderDate = new Date(order.createdAt);
          const day = orderDate.toLocaleDateString("en-US", { weekday: "short" });
          if (revenueByDay.has(day)) {
            revenueByDay.set(day, revenueByDay.get(day) + Number(order.grandTotal || 0));
          }
        });

        const recent = [...orders]
          .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
          .slice(0, 4)
          .map((order) => ({
            id: order.orderNumber,
            customer: order.shippingAddress?.name || order.userInfo?.name || "—",
            total: formatTk(order.grandTotal),
            payment: order.paymentStatus === "Paid" ? "Paid" : "Pending",
            status: order.orderStatus || "Pending",
          }));

        if (!alive) return;

        setStats({
          todayRevenue: paidOrders
            .filter((order) => new Date(order.createdAt).toDateString() === todayKey)
            .reduce((sum, order) => sum + Number(order.grandTotal || 0), 0),
          revenue: paidOrders.reduce((sum, order) => sum + Number(order.grandTotal || 0), 0),
          orders: orders.length,
          products: products.length,
          customers: accounts.filter((account) => account.role === "user").length,
          lowStock: lowStockProducts.length,
          shippingOrders: shippingOrders.length,
          paidOrders: paidOrders.length,
          inactiveBrands: brands.filter((brand) => !brand.isActive).length,
        });

        setRecentOrders(recent);
        setLowStockItems(
          lowStockProducts.map((product) => [
            product.name,
            `${Number(product.stockQuantity || 0)} left`,
            product.category?.name || "Uncategorized",
          ])
        );
        setWeeklyRevenue(
          [...revenueByDay.entries()].map(([day, value]) => ({ day, value }))
        );
      } catch (error) {
        showToast({
          tone: "danger",
          title: error.message || "Failed to load dashboard data.",
        });
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      alive = false;
    };
  }, [showToast]);

  const metricCards = useMemo(
    () => [
      ["Total Revenue", formatTk(stats.revenue), "Paid order revenue", "bg-main"],
      ["Orders", String(stats.orders).padStart(2, "0"), "Live backend orders", "bg-accent"],
      ["Products", String(stats.products).padStart(2, "0"), "Active catalog items", "bg-sky-500"],
      ["Users", String(stats.customers).padStart(2, "0"), "User accounts", "bg-emerald-500"],
    ],
    [stats]
  );

  return (
    <DashboardShell activeItem="Dashboard">
      <HeaderPanel stats={stats} />

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(([title, value, helper, color]) => (
          <article
            key={title}
            className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60"
          >
            <div className={`absolute inset-x-0 top-0 h-1.5 ${color}`} />
            <p className="text-sm font-black text-slate-500">{title}</p>
            <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              {value}
            </p>
            <p className="mt-3 text-xs font-bold leading-5 text-slate-400">
              {helper}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
        <RevenuePanel weeklyRevenue={weeklyRevenue} />
        <ActivityPanel stats={stats} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-lg font-black text-slate-950">Recent Orders</p>
            <p className="mt-1 text-sm font-bold text-slate-400">
              Latest backend orders
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-[0.25em] text-slate-300">
                  <th className="px-6 py-5">Order</th>
                  <th className="px-5 py-5">User</th>
                  <th className="px-5 py-5">Total</th>
                  <th className="px-5 py-5 text-center">Payment</th>
                  <th className="px-5 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm font-semibold text-slate-500">
                      Loading dashboard...
                    </td>
                  </tr>
                ) : recentOrders.length ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-6 py-5 text-sm font-black text-main">{order.id}</td>
                      <td className="px-5 py-5 text-sm font-black text-slate-700">{order.customer}</td>
                      <td className="px-5 py-5 text-sm font-black text-slate-800">{order.total}</td>
                      <td className="px-5 py-5 text-center">
                        <Badge tone={order.payment === "Paid" ? "green" : "yellow"}>{order.payment}</Badge>
                      </td>
                      <td className="px-5 py-5 text-center">
                        <Badge tone={order.status === "Delivered" ? "green" : order.status === "Shipping" ? "blue" : "gray"}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm font-semibold text-slate-500">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <p className="text-lg font-black text-slate-950">Quick Actions</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {[
                ["Add Product", "/dashboard/products/create", "cart"],
                ["Create Category", "/dashboard/categories/create", "folder"],
                ["Add Brand", "/dashboard/brands/create", "tag"],
                ["View Payments", "/dashboard/payment-details", "card"],
              ].map(([label, href, icon]) => (
                <a
                  key={label}
                  href={href}
                  className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 px-4 text-sm font-black text-main transition hover:bg-mainSoft"
                >
                  <Icon name={icon} className="h-5 w-5" />
                  {label}
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <p className="text-lg font-black text-slate-950">Low Stock</p>
            <div className="mt-5 space-y-4">
              {loading ? (
                <div className="rounded-2xl bg-mainSoft/55 p-4 text-sm font-semibold text-slate-500">
                  Loading low stock items...
                </div>
              ) : lowStockItems.length ? (
                lowStockItems.map(([name, stock, category]) => (
                  <div key={name} className="rounded-2xl bg-mainSoft/55 p-4">
                    <p className="text-sm font-black text-slate-800">{name}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {category} | {stock}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold text-slate-500">No low stock alerts.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
