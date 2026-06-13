"use client";

import Link from "next/link";
import { useMemo } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { mapBannerToSlide } from "@/lib/bannerApi";

const fallbackSlides = [
  {
    id: "fallback-1",
    src: "/home-pet-banner.png",
    alt: "Pet supplies arranged for online shopping",
    href: null,
  },
  {
    id: "fallback-2",
    src: "/home-pet-banner-food.png",
    alt: "Dog and cat food with pet care essentials",
    href: null,
  },
  {
    id: "fallback-3",
    src: "/home-pet-banner-small-pets.png",
    alt: "Fish, bird, and small pet supplies",
    href: null,
  },
];

export default function HomeBannerCarousel({ initialBanners = [] }) {
  const slides = useMemo(() => {
    if (!initialBanners.length) {
      return fallbackSlides;
    }

    return initialBanners.map(mapBannerToSlide);
  }, [initialBanners]);

  return (
    <section className="w-full bg-white px-4 py-4 sm:px-6 lg:px-8">
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
    <div className="relative aspect-[8/3] w-full overflow-hidden rounded-md border border-neutral-200 shadow-sm bg-neutral-50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.src}
        alt={slide.alt}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-contain object-center"
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
