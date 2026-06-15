import Container from "@/components/Container";
import BrandSidebar from "@/components/brand/BrandSidebar";
import ProductCard from "@/components/category/ProductCard";

export default function BrandPageContent({ brand, brands, products }) {
  const visibleProducts = products;

  return (
    <main className="bg-[#fbf7f1]">
      <Container>
        <div className="py-6 text-sm font-medium text-main/65">
          Home / <span className="font-black text-main">Brands</span> /{" "}
          <span className="font-black text-main">{brand.name}</span>
        </div>

        <div className="grid gap-8 pb-16 lg:grid-cols-[22rem_1fr]">
          <BrandSidebar brands={brands} activeBrand={brand} />

          <section>
            <div className="overflow-hidden rounded-2xl bg-main shadow-[0_20px_55px_rgba(23,63,49,0.18)]">
              <div className="relative min-h-72 bg-[radial-gradient(circle_at_88%_50%,rgba(242,140,56,0.55),transparent_22rem)] px-8 py-10 text-white sm:px-10">
                <div className="max-w-3xl">
                  <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black">
                    Brand
                  </span>
                  <h1 className="mt-6 text-5xl font-black leading-none sm:text-6xl">
                    {brand.name}
                  </h1>
                  <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-white/85">
                    {brand.description ||
                      `Browse trusted ${brand.name} products for your pets.`}
                  </p>
                  {brand.animalNames?.length ? (
                    <div className="mt-7 flex flex-wrap gap-3">
                      {brand.animalNames.map((animal) => (
                        <span
                          key={animal}
                          className="rounded-full bg-white/15 px-4 py-2 text-sm font-black"
                        >
                          {animal}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <span className="absolute right-10 top-1/2 hidden -translate-y-1/2 text-8xl sm:block">
                  🏷️
                </span>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_16px_45px_rgba(23,63,49,0.08)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-main">{brand.name} products</h2>
                <p className="mt-1 text-lg font-medium text-main/65">
                  {visibleProducts.length} products available
                </p>
              </div>

              <select className="h-12 rounded-lg border border-neutral-200 bg-white px-5 text-base font-medium text-main outline-none focus:border-main">
                <option>Sort: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>

            {visibleProducts.length > 0 ? (
              <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.slug || `${product.brand}-${product.name}`}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-16 text-center shadow-[0_16px_45px_rgba(23,63,49,0.08)]">
                <p className="text-xl font-black text-main">No products yet</p>
                <p className="mt-2 text-base font-medium text-main/65">
                  Products for {brand.name} will appear here once they are added in admin.
                </p>
              </div>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}
