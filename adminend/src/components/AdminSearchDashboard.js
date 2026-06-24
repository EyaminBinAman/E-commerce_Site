"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import { adminApi } from "@/lib/adminApi";
import { formatTk, getOrdersFromApi } from "@/lib/orderApi";

const SEARCH_LIMIT = 8;

function asText(value) {
  if (Array.isArray(value)) {
    return value.map(asText).join(" ");
  }

  if (value && typeof value === "object") {
    return Object.values(value).map(asText).join(" ");
  }

  return String(value || "");
}

function includesQuery(values, query) {
  return values.some((value) => asText(value).toLowerCase().includes(query));
}

function formatDate(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mapAccount(account) {
  return {
    id: account.id || account._id,
    name: account.name || "Unnamed account",
    email: account.email || "",
    phone: account.phone || "",
    role: account.role || "user",
    joined: formatDate(account.createdAt),
    isVerified: Boolean(account.isVerified),
  };
}

function normalizeProduct(product) {
  return {
    id: product._id,
    slug: product.slug,
    name: product.name || "Untitled product",
    brand: product.brand?.name || product.brandName || "No brand",
    category: product.category?.name || product.categoryName || "Uncategorized",
    price: Number(product.discountPrice || product.price || 0),
    stock: product.stockQuantity ?? 0,
    isActive: product.isActive !== false,
  };
}

function normalizeBrand(brand) {
  return {
    id: brand._id,
    slug: brand.slug,
    name: brand.name || "Untitled brand",
    animals: Array.isArray(brand.animalNames) ? brand.animalNames.filter(Boolean) : [],
    isActive: brand.isActive !== false,
  };
}

function normalizeCategory(category) {
  return {
    id: category._id,
    slug: category.slug,
    name: category.name || "Untitled category",
    animal: category.animalName || "",
    isActive: category.isActive !== false,
  };
}

function ResultSection({ title, count, children }) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <h2 className="text-sm font-black uppercase tracking-[0.28em] text-main/75">
          {title}
        </h2>
        <span className="text-xs font-black text-slate-400">{count} found</span>
      </div>
      <div className="divide-y divide-neutral-100">{children}</div>
    </section>
  );
}

function EmptySection({ label }) {
  return (
    <div className="px-5 py-8 text-center text-sm font-bold text-slate-400">
      No matching {label}.
    </div>
  );
}

function RowLink({ href, icon, title, subtitle, meta, children }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 px-5 py-4 transition hover:bg-mainSoft/45 md:flex-row md:items-center md:justify-between"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mainSoft text-main">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-800">{title}</p>
          <p className="mt-1 truncate text-xs font-semibold text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2 text-sm font-black text-main">
        {children}
        {meta ? <span>{meta}</span> : null}
      </div>
    </Link>
  );
}

export default function AdminSearchDashboard() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const query = (searchParams.get("search") || "").trim();
  const normalizedQuery = query.toLowerCase();
  const [data, setData] = useState({
    orders: [],
    products: [],
    customers: [],
    brands: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadSearchData() {
      setLoading(true);

      try {
        const [orders, productsJson, accountsJson, brandsJson, categoriesJson] =
          await Promise.all([
            getOrdersFromApi(),
            adminApi("/products/get-products?limit=200"),
            adminApi("/users/accounts"),
            adminApi("/brands/get-brands?includeInactive=true"),
            adminApi("/categories/get-categories?includeInactive=true"),
          ]);

        if (!alive) return;

        setData({
          orders,
          products: (productsJson.products || []).map(normalizeProduct),
          customers: (accountsJson.accounts || []).map(mapAccount),
          brands: (brandsJson.brands || []).map(normalizeBrand),
          categories: (categoriesJson.categories || []).map(normalizeCategory),
        });
      } catch (error) {
        if (!alive) return;
        showToast({
          tone: "danger",
          title: error.message || "Search data could not be loaded.",
        });
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    void loadSearchData();

    return () => {
      alive = false;
    };
  }, [showToast]);

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return {
        orders: [],
        products: [],
        customers: [],
        brands: [],
        categories: [],
      };
    }

    return {
      orders: data.orders.filter((order) =>
        includesQuery(
          [
            order.id,
            order.customer,
            order.email,
            order.phone,
            order.payment,
            order.paymentStatus,
            order.orderStatus,
            order.billStatus,
            order.promoCode,
            order.address,
            order.items,
          ],
          normalizedQuery
        )
      ),
      products: data.products.filter((product) =>
        includesQuery(
          [product.name, product.slug, product.brand, product.category, product.stock],
          normalizedQuery
        )
      ),
      customers: data.customers.filter((customer) =>
        includesQuery(
          [customer.name, customer.email, customer.phone, customer.role, customer.joined],
          normalizedQuery
        )
      ),
      brands: data.brands.filter((brand) =>
        includesQuery([brand.name, brand.slug, brand.animals], normalizedQuery)
      ),
      categories: data.categories.filter((category) =>
        includesQuery([category.name, category.slug, category.animal], normalizedQuery)
      ),
    };
  }, [data, normalizedQuery]);

  const totalResults = Object.values(results).reduce(
    (total, rows) => total + rows.length,
    0
  );

  return (
    <DashboardShell activeItem="Dashboard">
      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
          Global Search
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
          {query ? `Search results for "${query}"` : "Search the admin panel"}
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          Find orders, products, customers, brands, and categories from the top
          search bar.
        </p>
      </div>

      <div className="mt-5 rounded-[20px] border border-neutral-200 bg-white p-4 shadow-md shadow-main/5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-black text-slate-600">
            {loading
              ? "Loading search data..."
              : query
                ? `${totalResults} total result${totalResults === 1 ? "" : "s"}`
                : "Type in the top search bar and press Enter."}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge tone="blue">Orders {results.orders.length}</Badge>
            <Badge tone="gray">Products {results.products.length}</Badge>
            <Badge tone="gray">Customers {results.customers.length}</Badge>
            <Badge tone="gray">Catalog {results.brands.length + results.categories.length}</Badge>
          </div>
        </div>
      </div>

      {query ? (
        <div className="mt-5 grid gap-5">
          <ResultSection title="Orders" count={results.orders.length}>
            {results.orders.length ? (
              results.orders.slice(0, SEARCH_LIMIT).map((order) => (
                <RowLink
                  key={order.mongoId || order.id}
                  href={`/dashboard/orders/${order.mongoId}`}
                  icon="cart"
                  title={order.id}
                  subtitle={`${order.customer} - ${order.date} - ${order.payment}`}
                  meta={order.total}
                >
                  <Badge tone={order.orderStatus === "Delivered" ? "green" : "yellow"}>
                    {order.orderStatus}
                  </Badge>
                </RowLink>
              ))
            ) : (
              <EmptySection label="orders" />
            )}
          </ResultSection>

          <ResultSection title="Products" count={results.products.length}>
            {results.products.length ? (
              results.products.slice(0, SEARCH_LIMIT).map((product) => (
                <RowLink
                  key={product.id || product.slug}
                  href={`/dashboard/products/update?slug=${encodeURIComponent(product.slug)}`}
                  icon="cart"
                  title={product.name}
                  subtitle={`${product.brand} - ${product.category} - Stock ${product.stock}`}
                  meta={formatTk(product.price)}
                >
                  <Badge tone={product.isActive ? "green" : "gray"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </RowLink>
              ))
            ) : (
              <EmptySection label="products" />
            )}
          </ResultSection>

          <ResultSection title="Customers" count={results.customers.length}>
            {results.customers.length ? (
              results.customers.slice(0, SEARCH_LIMIT).map((customer) => (
                <RowLink
                  key={customer.id}
                  href={`/dashboard/customer-management/${customer.id}`}
                  icon="users"
                  title={customer.name}
                  subtitle={`${customer.email || "No email"} - ${customer.phone || "No phone"}`}
                  meta={customer.joined}
                >
                  <Badge tone={customer.role === "admin" ? "blue" : "gray"}>
                    {customer.role === "admin" ? "Admin" : "Client"}
                  </Badge>
                </RowLink>
              ))
            ) : (
              <EmptySection label="customers" />
            )}
          </ResultSection>

          <ResultSection title="Brands" count={results.brands.length}>
            {results.brands.length ? (
              results.brands.slice(0, SEARCH_LIMIT).map((brand) => (
                <RowLink
                  key={brand.id || brand.slug}
                  href={`/dashboard/brands/update?slug=${encodeURIComponent(brand.slug)}`}
                  icon="tag"
                  title={brand.name}
                  subtitle={brand.animals.length ? brand.animals.join(", ") : "No animals linked"}
                >
                  <Badge tone={brand.isActive ? "green" : "gray"}>
                    {brand.isActive ? "Active" : "Inactive"}
                  </Badge>
                </RowLink>
              ))
            ) : (
              <EmptySection label="brands" />
            )}
          </ResultSection>

          <ResultSection title="Categories" count={results.categories.length}>
            {results.categories.length ? (
              results.categories.slice(0, SEARCH_LIMIT).map((category) => (
                <RowLink
                  key={category.id || category.slug}
                  href={`/dashboard/categories/create?mode=update&slug=${encodeURIComponent(category.slug)}`}
                  icon="folder"
                  title={category.name}
                  subtitle={category.animal || "No animal linked"}
                >
                  <Badge tone={category.isActive ? "green" : "gray"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </RowLink>
              ))
            ) : (
              <EmptySection label="categories" />
            )}
          </ResultSection>
        </div>
      ) : null}
    </DashboardShell>
  );
}
