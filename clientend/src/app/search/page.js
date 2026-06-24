import Link from "next/link";

import Container from "@/components/Container";
import ProductCard from "@/components/category/ProductCard";
import { getProductsFromApi } from "@/lib/productApi";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = String(params?.q || "").trim();
  const products = query
    ? await getProductsFromApi({ search: query, limit: 60 })
    : [];

  return (
    <main className="bg-[#fbf7f1]">
      <Container className="py-8 lg:py-12">
        <div className="rounded-2xl bg-white p-6 shadow-[0_16px_45px_rgba(23,63,49,0.08)]">
          <p className="text-sm font-black uppercase tracking-wide text-accent">
            Search
          </p>
          <h1 className="mt-2 text-3xl font-black text-main">
            {query ? `Results for "${query}"` : "Search products"}
          </h1>
          <p className="mt-2 text-sm font-semibold text-main/60">
            {query
              ? `${products.length} product${products.length === 1 ? "" : "s"} found`
              : "Enter a search term from the header to find products."}
          </p>
        </div>

        {products.length ? (
          <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.slug || product._id || `${product.brand}-${product.name}`}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-16 text-center shadow-[0_16px_45px_rgba(23,63,49,0.08)]">
            <p className="text-xl font-black text-main">
              {query ? "No products found" : "Start searching"}
            </p>
            <p className="mt-2 text-base font-medium text-main/65">
              {query
                ? "Try a different product name, brand, or category keyword."
                : "Use the search bar above to find pet food, toys, litter, and care products."}
            </p>
            <Link
              href="/categories"
              className="mt-5 inline-flex h-12 items-center rounded-full bg-main px-6 text-sm font-black text-white transition hover:bg-main/90"
            >
              Browse categories
            </Link>
          </div>
        )}
      </Container>
    </main>
  );
}
