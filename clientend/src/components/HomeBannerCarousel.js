"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { apiRequest } from "@/lib/api";
import { mapBannerToSlide } from "@/lib/bannerApi";

export default function HomeBannerCarousel({ initialBanners = [] }) {
  const [bannerSlides, setBannerSlides] = useState(
    initialBanners.map(mapBannerToSlide)
  );

  useEffect(() => {
    let alive = true;

    if (initialBanners.length) {
      setBannerSlides(initialBanners.map(mapBannerToSlide));
      return () => {
        alive = false;
      };
    }

    apiRequest("/banners/get-banners")
      .then((data) => {
        if (!alive) return;
        const nextSlides = (data.banners || []).map((banner) => ({
          id: banner._id || banner.id,
          src: banner.imageUrl,
          alt: banner.altText || banner.name || "Home banner",
          href: banner.linkUrl || null,
        }));
        setBannerSlides(nextSlides);
      })
      .catch(() => {
        if (alive) setBannerSlides([]);
      });

    return () => {
      alive = false;
    };
  }, [initialBanners]);

  const slides = useMemo(() => bannerSlides, [bannerSlides]);

  if (!slides.length) {
    return null;
  }

  return (
    <section className="relative z-0 mt-4 w-full bg-white px-4 py-4 sm:px-6 lg:px-8">
      <Carousel opts={{ align: "start", loop: slides.length > 1 }} className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id || `${slide.src}-${index}`}>
              <Slide slide={slide} priority={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {slides.length > 1 ? (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        ) : null}
      </Carousel>
    </section>
  );
}

function Slide({ slide, priority }) {
  const image = (
    <div className="relative aspect-[8/3] w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 shadow-sm">
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        priority={priority}
        className="object-contain object-center"
        sizes="100vw"
      />
    </div>
  );

  if (slide.href) {
    return (
      <Link href={slide.href} className="block">
        {image}
      </Link>
    );
  }

  return image;
}
