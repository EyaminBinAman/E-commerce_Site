import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";

const payments = [
  {
    customer: "Eyamin",
    phone: "+8801300076779",
    order: "ORDER-000006",
    date: "6/9/2026",
    method: "Cash on delivery",
    subtotal: "Tk 600",
    delivery: "Tk 80",
    total: "Tk 680",
    payment: "Pending",
    orderStatus: "Processing",
  },
];

export default function PaymentDetailsDashboard() {
  return (
    <DashboardShell activeItem="Payment Details">
      <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-7 shadow-lg shadow-slate-200/60 md:px-8">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-[#4383a3]">
          Payments
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
          Payment Details
        </h1>
        <p className="mt-4 max-w-4xl text-sm font-semibold leading-7 text-slate-400 md:text-base">
          Track paid and unpaid orders before shipping. Once an order is
          shipped, it leaves this payment queue and continues through the order
          workflow.
        </p>

        <label className="mt-7 flex h-14 items-center rounded-2xl border border-slate-200 bg-white px-5 text-slate-400 shadow-inner shadow-slate-100">
          <Icon name="search" className="h-5 w-5" />
          <input
            type="search"
            aria-label="Search payment details"
            placeholder="Search by order ID, customer, phone, payment, or status..."
            className="ml-3 w-full bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
          />
        </label>
      </div>

      <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] border-collapse text-left">
            <thead className="bg-white">
              <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-[0.3em] text-slate-300">
                <th className="px-12 py-6">Customer</th>
                <th className="px-8 py-6">Order</th>
                <th className="px-8 py-6">Method</th>
                <th className="px-8 py-6 text-center">Subtotal</th>
                <th className="px-8 py-6 text-center">Delivery</th>
                <th className="px-8 py-6 text-center">Total</th>
                <th className="px-8 py-6 text-center">Payment</th>
                <th className="px-8 py-6 text-center">Order Status</th>
                <th className="px-10 py-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.order} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-12 py-7">
                    <p className="text-sm font-black text-slate-700">{payment.customer}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-400">{payment.phone}</p>
                  </td>
                  <td className="px-8 py-7">
                    <p className="text-sm font-black text-[#4383a3]">{payment.order}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-400">{payment.date}</p>
                  </td>
                  <td className="px-8 py-7 text-sm font-bold text-slate-500">{payment.method}</td>
                  <td className="px-8 py-7 text-center text-sm font-black text-slate-700">{payment.subtotal}</td>
                  <td className="px-8 py-7 text-center text-sm font-black text-slate-700">{payment.delivery}</td>
                  <td className="px-8 py-7 text-center text-sm font-black text-slate-800">{payment.total}</td>
                  <td className="px-8 py-7 text-center">
                    <Badge tone="yellow">{payment.payment}</Badge>
                  </td>
                  <td className="px-8 py-7 text-center">
                    <Badge tone="blue">{payment.orderStatus}</Badge>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col items-center gap-3">
                      <button
                        type="button"
                        className="h-11 rounded-2xl border border-sky-100 bg-sky-50 px-6 text-sm font-black text-[#4383a3] shadow-sm transition hover:bg-sky-100"
                      >
                        View order
                      </button>
                      <button
                        type="button"
                        className="h-12 rounded-2xl bg-[#248bcb] px-8 text-sm font-black text-white shadow-md shadow-sky-700/25 transition hover:bg-[#1978b4]"
                      >
                        Mark paid
                      </button>
                    </div>
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
