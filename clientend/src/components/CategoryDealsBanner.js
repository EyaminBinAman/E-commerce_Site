import Image from "next/image";

export default function CategoryDealsBanner() {
  return (
    <section className="bg-[#fff4ea] px-4 py-10 sm:px-6 lg:px-8">
      <Image
        src="/category-deals-banner.svg"
        alt="Limited-time savings. Deals that stay relevant to the category."
        width={1800}
        height={430}
        className="mx-auto block w-full max-w-7xl rounded-lg"
      />
    </section>
  );
}
