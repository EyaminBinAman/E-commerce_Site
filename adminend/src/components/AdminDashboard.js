import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";

const metrics = [
  ["Total Revenue", "Tk 28,738", "+18% this week", "bg-main"],
  ["Orders", "06", "1 waiting to ship", "bg-accent"],
  ["Products", "23", "3 low stock items", "bg-sky-500"],
  ["Customers", "12", "2 new this week", "bg-emerald-500"],
];

const revenueBars = [
  ["Mon", 44],
  ["Tue", 62],
  ["Wed", 38],
  ["Thu", 70],
  ["Fri", 58],
  ["Sat", 86],
  ["Sun", 64],
];

const quickActions = [
  ["Add Product", "/dashboard/products/create", "cart"],
  ["Create Category", "/dashboard/categories/create", "folder"],
  ["Add Brand", "/dashboard/brands/create", "tag"],
  ["View Payments", "/dashboard/payment-details", "card"],
];

const recentOrders = [
  ["ORDER-000006", "Eyamin", "Tk 680", "Pending", "Processing"],
  ["ORDER-000005", "Eyamin", "Tk 2,480", "Paid", "Delivered"],
  ["ORDER-000004", "Eyamin", "Tk 1,280", "Pending", "Cancelled"],
  ["ORDER-000003", "Eyamin", "Tk 21,280", "Paid", "Delivered"],
];

const lowStock = [
  ["Bird Seed Mix", "8 pack", "Bird Food"],
  ["Rabbit Mineral Snack", "6 pack", "Rabbit Food"],
  ["Rabbit Treat Pack", "10 pack", "Rabbit Food"],
];

function HeaderPanel() {
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
            Monitor store performance, orders, inventory, and admin tasks from
            one clean command center.
          </p>
        </div>

        <div className="rounded-2xl bg-mainSoft px-5 py-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-main">
            Today
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">Tk 8,100</p>
        </div>
      </div>
    </div>
  );
}

function RevenuePanel() {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-black text-slate-950">Weekly Revenue</p>
          <p className="mt-1 text-sm font-bold text-slate-400">
            Sales movement for this week
          </p>
        </div>
        <Badge tone="green">+18%</Badge>
      </div>

      <div className="mt-8 flex h-72 items-end gap-4 rounded-2xl bg-mainSoft/45 px-4 pb-4 pt-8">
        {revenueBars.map(([day, height]) => (
          <div key={day} className="flex min-w-0 flex-1 flex-col items-center gap-3">
            <div className="flex h-48 w-full items-end">
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-main to-accent shadow-lg shadow-main/10"
                style={{ height: `${height}%` }}
              />
            </div>
            <p className="text-xs font-black text-slate-500">{day}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityPanel() {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <p className="text-lg font-black text-slate-950">Store Health</p>
      <p className="mt-1 text-sm font-bold text-slate-400">
        Current operational snapshot
      </p>

      <div className="mt-7 space-y-5">
        {[
          ["Paid Orders", "04", "w-[68%]", "green"],
          ["Pending Payments", "02", "w-[34%]", "yellow"],
          ["Low Stock", "03", "w-[42%]", "blue"],
          ["Cancelled Orders", "01", "w-[18%]", "gray"],
        ].map(([label, value, width, tone]) => (
          <div key={label}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-slate-700">{label}</p>
              <Badge tone={tone}>{value}</Badge>
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
  return (
    <DashboardShell activeItem="Dashboard">
      <HeaderPanel />

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([title, value, helper, color]) => (
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
        <RevenuePanel />
        <ActivityPanel />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-lg font-black text-slate-950">Recent Orders</p>
            <p className="mt-1 text-sm font-bold text-slate-400">
              Latest customer activity
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-[0.25em] text-slate-300">
                  <th className="px-6 py-5">Order</th>
                  <th className="px-5 py-5">Customer</th>
                  <th className="px-5 py-5">Total</th>
                  <th className="px-5 py-5 text-center">Payment</th>
                  <th className="px-5 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(([id, customer, total, payment, status]) => (
                  <tr key={id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-6 py-5 text-sm font-black text-main">{id}</td>
                    <td className="px-5 py-5 text-sm font-black text-slate-700">{customer}</td>
                    <td className="px-5 py-5 text-sm font-black text-slate-800">{total}</td>
                    <td className="px-5 py-5 text-center">
                      <Badge tone={payment === "Paid" ? "green" : "yellow"}>{payment}</Badge>
                    </td>
                    <td className="px-5 py-5 text-center">
                      <Badge tone={status === "Delivered" ? "green" : status === "Processing" ? "blue" : "gray"}>
                        {status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <p className="text-lg font-black text-slate-950">Quick Actions</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {quickActions.map(([label, href, icon]) => (
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
              {lowStock.map(([name, stock, category]) => (
                <div key={name} className="rounded-2xl bg-mainSoft/55 p-4">
                  <p className="text-sm font-black text-slate-800">{name}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {category} | {stock} left
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
