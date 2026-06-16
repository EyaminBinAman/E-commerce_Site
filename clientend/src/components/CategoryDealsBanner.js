"use client";

import Link from "next/link";

import { getBannerImageUrl } from "@/lib/bannerApi";

export default function CategoryDealsBanner({ initialPromoBanners = [] }) {
  if (!initialPromoBanners.length) {
    return null;
  }

  return (
    <section className="bg-[#fff4ea] px-4 py-10 sm:px-6 lg:px-8">
      <div
        className={`mx-auto grid w-full max-w-7xl gap-4 ${
          initialPromoBanners.length > 1 ? "md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {initialPromoBanners.map((banner) => {
          const image = (
            <div className="relative aspect-[21/5] w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getBannerImageUrl(banner.imageUrl)}
                alt={banner.altText || banner.name}
                className="h-full w-full object-cover"
              />
            </div>
          );

          if (banner.linkUrl) {
            return (
              <Link key={banner._id} href={banner.linkUrl} className="block">
                {image}
              </Link>
            );
          }

          return <div key={banner._id}>{image}</div>;
        })}
      </div>
    </section>
  );
}
