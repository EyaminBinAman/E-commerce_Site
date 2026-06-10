import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";

const summaryCards = [
  {
    title: "All Orders",
    value: "05",
    description: "All paid-delivered and cancelled order records.",
    accent: "from-sky-400 to-cyan-300",
    ring: "ring-sky-100",
  },
  {
    title: "Completed Orders",
    value: "04",
    description: "Delivered orders whose payment is fully cleared.",
    accent: "from-emerald-400 to-teal-300",
    ring: "ring-emerald-100",
  },
  {
    title: "Cancelled Orders",
    value: "01",
    description: "Orders cancelled before completion.",
    accent: "from-rose-500 via-orange-400 to-amber-300",
    ring: "ring-orange-100",
  },
  {
    title: "Delivered Orders",
    value: "04",
    description: "All delivered orders whose payment is cleared.",
    accent: "from-violet-500 via-fuchsia-400 to-purple-300",
    ring: "ring-violet-100",
  },
];

const orders = [
  ["ORDER-000005", "Eyamin", "5/2/2026", "Cash on delivery", "PAID", "Tk 2,480", "Delivered", "Paid"],
  ["ORDER-000004", "Eyamin", "5/2/2026", "Cash on delivery", "PENDING", "Tk 1,280", "Cancelled", "Pending"],
  ["ORDER-000003", "Eyamin", "5/1/2026", "Cash on delivery", "PAID", "Tk 21,280", "Delivered", "Paid"],
  ["ORDER-000002", "Eyamin", "5/1/2026", "Cash on delivery", "PAID", "Tk 2,348", "Delivered", "Paid"],
  ["ORDER-000001", "Eyamin", "5/1/2026", "Cash on delivery", "PAID", "Tk 1,350", "Delivered", "Paid"],
];

export default function OrderHistoryDashboard() {
  return (
    <DashboardShell activeItem="Order History">
      <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-7 shadow-lg shadow-slate-200/60 md:px-8">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-[#4383a3]">Orders</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Order History</h1>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-slate-400 md:text-base">
          Review paid-and-delivered orders and cancelled orders, then open any record for full details.
        </p>

        <label className="mt-7 flex h-14 items-center rounded-2xl border border-slate-200 bg-white px-5 text-slate-400 shadow-inner shadow-slate-100">
          <Icon name="search" className="h-5 w-5" />
          <input type="search" aria-label="Search order history" placeholder="Search by order ID, customer, payment, or status..." className="ml-3 w-full bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300" />
        </label>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article key={card.title} className={`relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70 ring-1 ${card.ring}`}>
            <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.accent}`} />
            <p className="text-base font-extrabold text-slate-500">{card.title}</p>
            <p className="mt-5 text-4xl font-black tracking-tight text-slate-950">{card.value}</p>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-400">{card.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
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
              {orders.map(([id, customer, date, payment, paymentStatus, total, orderStatus, billStatus]) => (
                <tr key={id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-14 py-7 text-sm font-black text-slate-700">{id}</td>
                  <td className="px-8 py-7">
                    <p className="text-sm font-black text-slate-700">{customer}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-400">{date}</p>
                  </td>
                  <td className="px-8 py-7 text-center">
                    <p className="text-sm font-semibold text-slate-500">{payment}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.25em] text-slate-400">{paymentStatus}</p>
                  </td>
                  <td className="px-8 py-7 text-sm font-black text-slate-800">{total}</td>
                  <td className="px-8 py-7">
                    <div className="flex items-center justify-center gap-2">
                      <Badge tone={orderStatus === "Delivered" ? "green" : "gray"}>{orderStatus}</Badge>
                      <Badge tone={billStatus === "Paid" ? "green" : "yellow"}>{billStatus}</Badge>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-center">
                    <button type="button" className="h-11 rounded-2xl bg-[#3488c7] px-6 text-sm font-black text-white shadow-md shadow-sky-700/25 transition hover:bg-[#2674ad]">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
