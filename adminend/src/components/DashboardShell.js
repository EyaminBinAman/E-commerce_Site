const navGroups = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: "grid", href: "#" },
      { label: "Invoices", icon: "invoice", href: "#" },
      { label: "Orders", icon: "cart", href: "/dashboard/orders" },
      { label: "Customer Management", icon: "users", href: "/dashboard/customer-management" },
      { label: "Customer Comments", icon: "chat", href: "#" },
      { label: "Payment Details", icon: "card", href: "/dashboard/payment-details" },
      { label: "Sales Reports", icon: "chart", href: "#" },
      { label: "Order History", icon: "clock", href: "/dashboard/order-history" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { label: "Categories", icon: "folder", href: "/dashboard/categories" },
      { label: "Brands", icon: "tag", href: "/dashboard/brands" },
      { label: "Products", icon: "cart", href: "/dashboard/products" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Promo Banners", icon: "megaphone", href: "#" },
      { label: "Promo Codes", icon: "tag", href: "#" },
      { label: "Delivery Charges", icon: "card", href: "#" },
    ],
  },
];

export function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const paths = {
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
      </>
    ),
    invoice: (
      <>
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M15 3v5h5" />
        <path d="M10 13h6" />
        <path d="M10 17h4" />
      </>
    ),
    cart: (
      <>
        <path d="M3 5h2l2.2 10.5a2 2 0 0 0 2 1.5h7.9a2 2 0 0 0 2-1.5L21 8H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
        <path d="M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
    chat: (
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    ),
    card: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </>
    ),
    chart: (
      <>
        <path d="M5 20V10" />
        <path d="M12 20V4" />
        <path d="M19 20v-7" />
        <rect x="3" y="10" width="4" height="10" rx="1" />
        <rect x="10" y="4" width="4" height="16" rx="1" />
        <rect x="17" y="13" width="4" height="7" rx="1" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    folder: (
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    ),
    tag: (
      <>
        <path d="M20 13 11 4H5v6l9 9a2 2 0 0 0 3 0l3-3a2 2 0 0 0 0-3z" />
        <path d="M8 7h.01" />
      </>
    ),
    megaphone: (
      <>
        <path d="m3 11 18-5v12L3 14z" />
        <path d="M7 15v4a2 2 0 0 0 2 2h1" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 10v6" />
        <path d="M14 10v6" />
      </>
    ),
    x: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    edit: (
      <>
        <path d="M3 21h6" />
        <path d="M14.5 4.5a2.1 2.1 0 0 1 3 3L8 17l-4 1 1-4z" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

export function Badge({ children, tone }) {
  const tones = {
    green: "bg-emerald-100 text-emerald-700",
    yellow: "bg-amber-100 text-amber-700",
    gray: "bg-slate-100 text-slate-600",
    blue: "bg-mainSoft text-main",
  };

  return (
    <span className={`inline-flex min-w-16 items-center justify-center rounded-full px-3 py-1 text-xs font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Sidebar({ activeItem }) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <div className="flex items-center gap-4">
        <button type="button" aria-label="Open menu" className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 shadow-sm">
          <Icon name="menu" className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-main to-accent text-lg font-black text-white shadow-lg shadow-main/20">
            A
          </div>
          <div>
            <p className="text-lg font-black text-main">AdminFlow</p>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-400">Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="mt-8 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-2 text-xs font-black uppercase tracking-[0.35em] text-slate-300">{group.title}</p>
            <div className="mt-3 space-y-1.5">
              {group.items.map((item) => {
                const isActive = item.label === activeItem;

                return (
                  <a
                    href={item.href}
                    key={`${group.title}-${item.label}`}
                    className={`flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-extrabold transition ${
                      isActive
                        ? "bg-mainSoft text-main shadow-inner"
                        : "text-slate-500 hover:bg-mainSoft/60 hover:text-main"
                    }`}
                  >
                    <Icon name={item.icon} className="h-5 w-5" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-neutral-200 bg-mainSoft/60 px-3 backdrop-blur md:px-6 lg:px-8">
      <div className="flex items-center gap-3 lg:hidden">
        <button type="button" aria-label="Open menu" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-slate-500 shadow-sm">
          <Icon name="menu" className="h-5 w-5" />
        </button>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-main to-accent text-base font-black text-white">
          A
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-2xl items-center rounded-xl border border-neutral-200 bg-white px-4 py-3 text-slate-400 shadow-sm md:flex">
        <Icon name="search" className="h-5 w-5" />
        <span className="ml-4 text-sm font-bold">Search Orders, Products, Customers...</span>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" aria-label="Notifications" className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-main shadow-sm">
          <Icon name="bell" className="h-5 w-5" />
          <span className="absolute right-2 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-black text-white">1</span>
        </button>
        <div className="flex h-14 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main font-black text-white">E</div>
          <div className="hidden pr-1 sm:block">
            <p className="text-sm font-black text-main">Eyamin</p>
            <p className="text-xs font-bold text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function DashboardShell({ activeItem, children, notice }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-mainSoft/70 via-white to-white text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar activeItem={activeItem} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          {notice ? (
            <div className="pointer-events-none fixed right-5 top-8 z-30 hidden rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-700 shadow-lg shadow-emerald-100/70 md:flex md:min-w-80 md:items-center md:gap-3">
              <Icon name="check" className="h-5 w-5 text-emerald-600" />
              {notice}
            </div>
          ) : null}
          <section className="flex-1 px-3 py-6 md:px-5 lg:px-6">{children}</section>
          <footer className="flex flex-col gap-2 border-t border-slate-200 bg-white px-4 py-5 text-sm font-bold text-slate-500 md:flex-row md:items-center md:justify-between lg:px-6">
            <p>Powered by AdminFlow. Copyrights all rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-main">Terms</a>
              <a href="#" className="hover:text-main">Policy</a>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
