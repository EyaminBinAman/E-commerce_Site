"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { apiRequest } from "@/lib/api";

const fallbackSlides = [
  {
    src: "/home-pet-banner.png",
    alt: "Pet supplies arranged for online shopping",
  },
  {
    src: "/home-pet-banner-food.png",
    alt: "Dog and cat food with pet care essentials",
  },
  {
    src: "/home-pet-banner-small-pets.png",
    alt: "Fish, bird, and small pet supplies",
  },
];

const slideAssets = {
  "hero-banner": "/home-pet-banner.png",
  "promo-banner": "/home-pet-banner-food.png",
  "slider-banner": "/home-pet-banner-small-pets.png",
};

export default function HomeBannerCarousel() {
  const [bannerSlides, setBannerSlides] = useState(fallbackSlides);

  useEffect(() => {
    let alive = true;

    apiRequest("/banners/get-banners")
      .then((data) => {
        if (!alive) return;

        const nextSlides = (data.banners || []).map((banner) => ({
          src: slideAssets[banner.bannerType] || fallbackSlides[0].src,
          alt: banner.name,
        }));

        if (nextSlides.length) {
          setBannerSlides(nextSlides);
        }
      })
      .catch(() => {
        if (alive) setBannerSlides(fallbackSlides);
      });

    return () => {
      alive = false;
    };
  }, []);

  const slides = useMemo(
    () => (bannerSlides.length ? bannerSlides : fallbackSlides),
    [bannerSlides]
  );

  return (
    <section className="w-full bg-white px-4 py-4 sm:px-6 lg:px-8">
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={`${slide.src}-${slide.alt}`}>
              <div className="relative aspect-[8/3] w-full overflow-hidden rounded-md border border-neutral-200 shadow-sm">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-contain object-center"
                  sizes="100vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
