import DashboardShell, { Badge } from "@/components/DashboardShell";
import { findAdminOrder } from "@/data/adminOrders";

function statusTone(status) {
  const tones = {
    Pending: "yellow",
    Processing: "blue",
    Shipping: "blue",
    Delivered: "green",
    Cancelled: "gray",
    Due: "yellow",
    Paid: "green",
  };

  return tones[status] || "gray";
}

function InfoCard({ title, children }) {
  return (
    <section className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-main/70">
        {title}
      </p>
      <div className="mt-4 space-y-2">{children}</div>
    </section>
  );
}

export default async function OrderDetailsPage({ params }) {
  const { orderId } = await params;
  const order = findAdminOrder(decodeURIComponent(orderId));

  if (!order) {
    return (
      <DashboardShell activeItem="Orders">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-lg shadow-main/5">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
            Order Details
          </p>
          <h1 className="mt-3 text-3xl font-black text-main">Order not found</h1>
          <a
            href="/dashboard/orders"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-main px-5 text-sm font-black text-white"
          >
            Back to Orders
          </a>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell activeItem="Orders">
      <div className="rounded-[28px] border border-neutral-200 bg-white px-6 py-7 shadow-lg shadow-main/5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
              Order Details
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-main md:text-4xl">
              {order.id}
            </h1>
            <p className="mt-3 text-sm font-semibold text-slate-400">
              Placed on {order.date}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={statusTone(order.orderStatus)}>{order.orderStatus}</Badge>
            <Badge tone={statusTone(order.billStatus)}>{order.billStatus}</Badge>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <InfoCard title="Customer">
          <p className="text-lg font-black text-slate-800">{order.customer}</p>
          <p className="text-sm font-bold text-slate-500">{order.phone}</p>
          <p className="text-sm font-bold text-slate-500">{order.email}</p>
        </InfoCard>

        <InfoCard title="Payment">
          <p className="text-lg font-black text-slate-800">{order.payment}</p>
          <p className="text-sm font-bold text-slate-500">
            Payment status: {order.paymentStatus}
          </p>
          <p className="text-sm font-bold text-slate-500">
            Bill status: {order.billStatus}
          </p>
        </InfoCard>

        <InfoCard title="Delivery Address">
          <p className="text-lg font-black text-slate-800">{order.city}</p>
          <p className="text-sm font-bold leading-6 text-slate-500">{order.address}</p>
          <p className="text-sm font-bold text-slate-500">{order.notes}</p>
        </InfoCard>
      </div>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
        <div className="border-b border-neutral-100 px-6 py-5">
          <p className="text-lg font-black text-slate-950">Products</p>
          <p className="mt-1 text-sm font-bold text-slate-400">
            Quantity, price, discount, discounted price, and item total.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead>
              <tr className="border-b border-neutral-100 text-xs font-black uppercase tracking-[0.22em] text-slate-300">
                <th className="px-6 py-5">Product</th>
                <th className="px-5 py-5">SKU</th>
                <th className="px-5 py-5 text-center">Quantity</th>
                <th className="px-5 py-5">Price</th>
                <th className="px-5 py-5">Discount</th>
                <th className="px-5 py-5">Discounted Price</th>
                <th className="px-6 py-5 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.sku} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-6 py-5 text-sm font-black text-slate-800">{item.name}</td>
                  <td className="px-5 py-5 text-sm font-bold text-slate-500">{item.sku}</td>
                  <td className="px-5 py-5 text-center text-sm font-black text-main">{item.quantity}</td>
                  <td className="px-5 py-5 text-sm font-bold text-slate-600">{item.price}</td>
                  <td className="px-5 py-5 text-sm font-bold text-accent">{item.discount}</td>
                  <td className="px-5 py-5 text-sm font-black text-slate-800">{item.discountedPrice}</td>
                  <td className="px-6 py-5 text-right text-sm font-black text-slate-800">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
          <p className="text-lg font-black text-slate-950">Order Status</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-400">
            Current workflow state is {order.orderStatus}. Payment method is {order.payment}.
          </p>
        </div>

        <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
          <p className="text-lg font-black text-slate-950">Payment Summary</p>
          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Subtotal</span>
              <span>{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Discount</span>
              <span>{order.discount}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Delivery Charge</span>
              <span>{order.delivery}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-3 text-xl font-black text-main">
              <span>Total</span>
              <span>{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
