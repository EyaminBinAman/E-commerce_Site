import DashboardShell, { Badge } from "@/components/DashboardShell";

const reportCards = [
  {
    title: "Revenue",
    value: "BDT 680.00",
    helper: "-97.5% vs previous month",
    accent: "from-cyan-400 to-sky-300",
    marker: "bg-cyan-400",
  },
  {
    title: "Sales Profit",
    value: "BDT 180.00",
    helper: "-99.3% from paid orders only",
    accent: "from-emerald-400 to-teal-300",
    marker: "bg-emerald-400",
  },
  {
    title: "Gross Profit",
    value: "BDT 180.00",
    helper: "Based on product buy price matched to sold items",
    accent: "from-violet-500 to-fuchsia-300",
    marker: "bg-violet-400",
  },
  {
    title: "Net Profit",
    value: "BDT 680.00",
    helper: "-97.5% after supplier invoice spend",
    accent: "from-amber-400 to-orange-300",
    marker: "bg-amber-400",
  },
  {
    title: "Orders Closed",
    value: "1",
    helper: "0 supplier invoices in the same month",
    accent: "from-cyan-400 to-sky-300",
    marker: "bg-cyan-400",
  },
  {
    title: "Growth Rate",
    value: "-97.5%",
    helper: "Previous month revenue was Tk 27,458",
    accent: "from-violet-500 to-fuchsia-300",
    marker: "bg-violet-400",
  },
  {
    title: "Procurement Spend",
    value: "BDT 0.00",
    helper: "Supplier invoice subtotal inside the selected period.",
    accent: "from-amber-400 to-orange-300",
    marker: "bg-amber-400",
  },
  {
    title: "Supplier Invoices",
    value: "0",
    helper: "Recorded procurement documents within the active range.",
    accent: "from-emerald-400 to-teal-300",
    marker: "bg-emerald-400",
  },
];

const flowPoints = [
  ["Jun 1", "BDT 0", 16, 8],
  ["Jun 3", "BDT 0", 24, 12],
  ["Jun 5", "BDT 0", 18, 10],
  ["Jun 7", "BDT 0", 30, 18],
  ["Jun 9", "BDT 680", 82, 44],
  ["Jun 11", "BDT 0", 28, 14],
  ["Jun 13", "BDT 0", 20, 10],
];

const categoryMix = [
  { label: "Dog Food", value: "62%", color: "bg-main", amount: "BDT 421.60" },
  { label: "Cat Food", value: "22%", color: "bg-cyan-400", amount: "BDT 149.60" },
  { label: "Rabbit Food", value: "10%", color: "bg-accent", amount: "BDT 68.00" },
  { label: "Others", value: "6%", color: "bg-violet-400", amount: "BDT 40.80" },
];

const productMix = [
  {
    label: "Puppy Beef Food",
    value: "55%",
    color: "bg-main",
    amount: "BDT 374.00",
  },
  {
    label: "Chicken Cat Food",
    value: "25%",
    color: "bg-emerald-400",
    amount: "BDT 170.00",
  },
  { label: "Cat Litter", value: "12%", color: "bg-cyan-400", amount: "BDT 81.60" },
  { label: "Rabbit Treat", value: "8%", color: "bg-accent", amount: "BDT 54.40" },
];

const topProducts = [
  ["1kg Beef Flavour for Puppy Dogs", "Dog Food", "1", "BDT 680.00", "BDT 180.00"],
  ["Chicken Flavour Cat Food", "Cat Food", "0", "BDT 0.00", "BDT 0.00"],
  ["Cat Litter 10L", "Cat Litter", "0", "BDT 0.00", "BDT 0.00"],
  ["Rabbit Treat Pack", "Rabbit Food", "0", "BDT 0.00", "BDT 0.00"],
];

const recentSales = [
  ["ORDER-000006", "Eyamin", "6/9/2026", "Cash on delivery", "Pending", "Processing", "BDT 680.00"],
  ["ORDER-000005", "Eyamin", "5/2/2026", "Cash on delivery", "Paid", "Delivered", "BDT 2,480.00"],
  ["ORDER-000004", "Eyamin", "5/2/2026", "Cash on delivery", "Pending", "Cancelled", "BDT 1,280.00"],
  ["ORDER-000003", "Eyamin", "5/1/2026", "Cash on delivery", "Paid", "Delivered", "BDT 21,280.00"],
];

function ReportHeader() {
  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white px-6 py-7 shadow-lg shadow-main/5 md:px-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
            Reports
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-main md:text-4xl">
            Sales Reports
          </h1>
          <p className="mt-4 max-w-4xl text-sm font-semibold leading-7 text-slate-400 md:text-base">
            Review daily, weekly, monthly, and yearly revenue, profit,
            procurement spend, and top-selling products from live backend data.
          </p>
          <p className="mt-5 text-sm font-black text-slate-600">
            Active range: June 2026
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label>
            <span className="text-sm font-black text-slate-600">Report Type</span>
            <select
              defaultValue="Monthly"
              className="mt-2 h-12 w-full rounded-xl border border-cyan-200 bg-white px-4 text-sm font-black text-slate-700 outline-none shadow-sm focus:border-cyan-400"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </label>
          <label>
            <span className="text-sm font-black text-slate-600">Anchor Date</span>
            <input
              type="date"
              defaultValue="2026-06-09"
              className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm font-black text-slate-700 outline-none shadow-sm focus:border-main"
            />
          </label>
          <button
            type="button"
            className="mt-7 h-12 rounded-xl bg-[#268ccd] px-6 text-sm font-black text-white shadow-md shadow-sky-700/20 transition hover:bg-[#1f78af]"
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCards() {
  const primaryCards = reportCards.slice(0, 5);
  const secondaryCards = reportCards.slice(5);

  return (
    <div className="mt-6 space-y-5">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {primaryCards.map((card) => (
          <MetricCard key={card.title} card={card} />
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {secondaryCards.map((card) => (
          <MetricCard key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
}

function MetricCard({ card }) {
  return (
    <article className="relative flex min-h-44 flex-col overflow-hidden rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.accent}`} />
      <p className="text-sm font-black text-slate-500">{card.title}</p>
      <p className="mt-4 whitespace-nowrap text-[clamp(1.45rem,1.65vw,2rem)] font-black leading-tight tracking-tight text-slate-950">
        {card.value}
      </p>
      <p className="mt-auto pr-14 pt-7 text-sm font-bold leading-6 text-slate-400">
        {card.helper}
      </p>
      <span
        className={`absolute bottom-5 right-5 h-12 w-12 rounded-2xl ${card.marker} shadow-lg opacity-95`}
      />
    </article>
  );
}

function FlowChart() {
  return (
    <section className="mt-6 rounded-[24px] border border-neutral-200 bg-white p-6 shadow-lg shadow-main/5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
            Revenue Trends
          </p>
          <h2 className="mt-3 text-2xl font-black text-slate-950">
            Sales and profit flow
          </h2>
        </div>
        <div className="flex gap-5 text-sm font-black text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-400" />
            Sales
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            Profit
          </span>
        </div>
      </div>

      <div className="mt-8 grid min-h-72 gap-4 rounded-2xl bg-mainSoft/35 px-4 pb-5 pt-8 sm:grid-cols-7">
        {flowPoints.map(([label, amount, sales, profit]) => (
          <div key={label} className="flex min-w-0 flex-col items-center justify-end gap-3">
            <div className="flex h-44 w-full items-end justify-center gap-2">
              <div
                className="w-5 rounded-t-full bg-cyan-400 shadow-lg shadow-cyan-200"
                style={{ height: `${sales}%` }}
              />
              <div
                className="w-5 rounded-t-full bg-emerald-400 shadow-lg shadow-emerald-200"
                style={{ height: `${profit}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-slate-500">{label}</p>
              <p className="mt-1 text-[11px] font-bold text-slate-400">{amount}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PieChartPanel({ title, subtitle, data, gradient, centerLabel }) {
  return (
    <section className="rounded-[24px] border border-neutral-200 bg-white p-6 shadow-lg shadow-main/5">
      <div>
        <p className="text-lg font-black text-slate-950">{title}</p>
        <p className="mt-1 text-sm font-bold text-slate-400">{subtitle}</p>
      </div>

      <div className="mt-7 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
        <div className="relative mx-auto h-52 w-52 rounded-full shadow-inner" style={{ background: gradient }}>
          <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-white shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Total
            </p>
            <p className="mt-2 text-xl font-black text-main">{centerLabel}</p>
          </div>
        </div>

        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 rounded-2xl bg-mainSoft/35 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className={`h-3.5 w-3.5 shrink-0 rounded-full ${item.color}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-700">{item.label}</p>
                  <p className="mt-0.5 text-xs font-bold text-slate-400">{item.amount}</p>
                </div>
              </div>
              <p className="text-sm font-black text-main">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopProductsTable() {
  return (
    <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
      <div className="border-b border-neutral-100 px-6 py-5">
        <p className="text-lg font-black text-slate-950">Top Selling Products</p>
        <p className="mt-1 text-sm font-bold text-slate-400">
          Revenue and profit contribution by item
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-neutral-100 text-xs font-black uppercase tracking-[0.25em] text-slate-300">
              <th className="px-6 py-5">Product</th>
              <th className="px-5 py-5">Category</th>
              <th className="px-5 py-5 text-center">Sold</th>
              <th className="px-5 py-5">Revenue</th>
              <th className="px-5 py-5">Profit</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map(([product, category, sold, revenue, profit]) => (
              <tr key={product} className="border-b border-neutral-100 last:border-b-0">
                <td className="px-6 py-5 text-sm font-black text-slate-800">{product}</td>
                <td className="px-5 py-5 text-sm font-bold text-slate-500">{category}</td>
                <td className="px-5 py-5 text-center text-sm font-black text-main">{sold}</td>
                <td className="px-5 py-5 text-sm font-black text-slate-800">{revenue}</td>
                <td className="px-5 py-5 text-sm font-black text-emerald-600">{profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RecentSalesTable() {
  return (
    <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
      <div className="border-b border-neutral-100 px-6 py-5">
        <p className="text-lg font-black text-slate-950">Closed Sales</p>
        <p className="mt-1 text-sm font-bold text-slate-400">
          Orders included in this report period
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left">
          <thead>
            <tr className="border-b border-neutral-100 text-xs font-black uppercase tracking-[0.25em] text-slate-300">
              <th className="px-6 py-5">Order ID</th>
              <th className="px-5 py-5">Customer</th>
              <th className="px-5 py-5">Date</th>
              <th className="px-5 py-5">Method</th>
              <th className="px-5 py-5 text-center">Payment</th>
              <th className="px-5 py-5 text-center">Status</th>
              <th className="px-6 py-5">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map(([id, customer, date, method, payment, status, total]) => (
              <tr key={id} className="border-b border-neutral-100 last:border-b-0">
                <td className="px-6 py-5 text-sm font-black text-main">{id}</td>
                <td className="px-5 py-5 text-sm font-black text-slate-700">{customer}</td>
                <td className="px-5 py-5 text-sm font-bold text-slate-500">{date}</td>
                <td className="px-5 py-5 text-sm font-bold text-slate-500">{method}</td>
                <td className="px-5 py-5 text-center">
                  <Badge tone={payment === "Paid" ? "green" : "yellow"}>{payment}</Badge>
                </td>
                <td className="px-5 py-5 text-center">
                  <Badge
                    tone={
                      status === "Delivered"
                        ? "green"
                        : status === "Processing"
                          ? "blue"
                          : "gray"
                    }
                  >
                    {status}
                  </Badge>
                </td>
                <td className="px-6 py-5 text-sm font-black text-slate-800">{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function SalesReportDashboard() {
  return (
    <DashboardShell activeItem="Sales Reports">
      <ReportHeader />
      <MetricCards />
      <FlowChart />

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <PieChartPanel
          title="Category Mix"
          subtitle="Revenue split by product category"
          data={categoryMix}
          centerLabel="BDT 680"
          gradient="conic-gradient(#173f31 0deg 223deg, #22c1e8 223deg 302deg, #f28c38 302deg 338deg, #a78bfa 338deg 360deg)"
        />
        <PieChartPanel
          title="Product Mix"
          subtitle="Top product revenue contribution"
          data={productMix}
          centerLabel="BDT 680"
          gradient="conic-gradient(#173f31 0deg 198deg, #34d399 198deg 288deg, #22c1e8 288deg 331deg, #f28c38 331deg 360deg)"
        />
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-2">
        <TopProductsTable />
        <RecentSalesTable />
      </div>
    </DashboardShell>
  );
}
