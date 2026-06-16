"use client";

import Link from "next/link";

import BannerImage from "@/components/BannerImage";

export default function CategoryDealsBanner({ initialPromoBanners = [] }) {
  const promoBanners = initialPromoBanners.filter((banner) => banner?.imageUrl);

  if (!promoBanners.length) {
    return null;
  }

  const isPair = promoBanners.length > 1;

  return (
    <section className="bg-[#fff4ea] px-4 py-10 sm:px-6 lg:px-8">
      <div
        className={`mx-auto grid w-full max-w-7xl gap-4 ${
          isPair ? "md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {promoBanners.map((banner) => {
          const bannerId = banner._id || banner.id;
          const image = (
            <div className="relative w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
              <div
                className={`w-full ${
                  isPair
                    ? "aspect-[4/3] sm:aspect-[3/2] md:max-h-[260px]"
                    : "aspect-[5/2] sm:aspect-[21/8] md:max-h-[280px]"
                }`}
              >
                <BannerImage
                  imageUrl={banner.imageUrl}
                  alt={banner.altText || banner.name || "Promo banner"}
                  wrapperClassName="h-full w-full"
                />
              </div>
            </div>
          );

          if (banner.linkUrl) {
            return (
              <Link key={bannerId} href={banner.linkUrl} className="block">
                {image}
              </Link>
            );
          }

          return <div key={bannerId}>{image}</div>;
        })}
      </div>
    </section>
  );
}
