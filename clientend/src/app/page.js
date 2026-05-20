import Container from "@/components/Container.jsx";

export default function Home() {
  return (
    <>
      <main className="bg-orange-50 py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              PawTail shop
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-emerald-950 sm:text-5xl">
              Temporary homepage content
            </h1>
            <p className="mt-5 text-base leading-7 text-emerald-900/75 sm:text-lg">
              This area is ready for the ecommerce homepage sections. The
              starter Next.js content has been removed so the footer can sit
              naturally below the page content.
            </p>
          </div>
        </Container>
      </main>
    </>
  );
}
