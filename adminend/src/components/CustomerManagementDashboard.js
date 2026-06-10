import DashboardShell, { Badge } from "@/components/DashboardShell";

const customers = [
  {
    name: "Test User4",
    phone: "01500000000",
    joined: "4/19/2026",
    phoneStatus: "Not verified",
    isActive: true,
  },
  {
    name: "Test User3",
    phone: "01400000000",
    joined: "4/19/2026",
    phoneStatus: "Not verified",
    isActive: true,
  },
  {
    name: "Test User",
    phone: "01200000000",
    joined: "4/19/2026",
    phoneStatus: "Not verified",
    isActive: true,
  },
];

const summaryCards = [
  {
    title: "Total Users",
    value: String(customers.length).padStart(2, "0"),
    description: "All customer accounts currently in the system.",
    accent: "from-accent to-accentSoft",
    ring: "ring-accent/20",
  },
  {
    title: "Active Users",
    value: String(customers.filter((item) => item.isActive).length).padStart(2, "0"),
    description: "Customer accounts that are currently active.",
    accent: "from-main to-main/70",
    ring: "ring-main/15",
  },
  {
    title: "Verified Users",
    value: String(customers.filter((item) => item.phoneStatus === "Verified").length).padStart(2, "0"),
    description: "Customers whose phone numbers are verified.",
    accent: "from-mainHover to-main",
    ring: "ring-main/20",
  },
];

export default function CustomerManagementDashboard() {
  return (
    <DashboardShell activeItem="Customer Management">
      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-4 shadow-lg shadow-main/5 md:px-6">
        <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
              Customers
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
              Customer Management
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
              Review all signup customers, their phone numbers, join dates, and
              verification status from one place.
            </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <article
            key={card.title}
            className={`relative overflow-hidden rounded-[20px] border border-neutral-200 bg-white p-4 shadow-md shadow-main/5 ring-1 ${card.ring}`}
          >
            <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.accent}`} />
            <p className="text-sm font-extrabold text-slate-500">{card.title}</p>
            <p className="mt-2 text-[1.75rem] font-black tracking-tight text-main">
              {card.value}
            </p>
            <p className="mt-1.5 text-xs font-semibold leading-5 text-slate-400">
              {card.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-left">
            <thead className="bg-mainSoft/50">
              <tr className="border-b border-neutral-100 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                <th className="px-12 py-5">Customer Name</th>
                <th className="px-8 py-5">Phone Number</th>
                <th className="px-8 py-5">Joined</th>
                <th className="px-8 py-5 text-center">Phone Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={`${customer.name}-${customer.phone}`}
                  className="border-b border-neutral-100 last:border-b-0"
                >
                  <td className="px-12 py-6 text-sm font-black text-main">
                    {customer.name}
                  </td>
                  <td className="px-8 py-6 text-sm font-semibold text-slate-600">
                    {customer.phone}
                  </td>
                  <td className="px-8 py-6 text-sm font-semibold text-slate-500">
                    {customer.joined}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <Badge
                      tone={
                        customer.phoneStatus === "Verified" ? "green" : "yellow"
                      }
                    >
                      {customer.phoneStatus}
                    </Badge>
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
