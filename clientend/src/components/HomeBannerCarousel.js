import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const bannerSlides = [
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

export default function HomeBannerCarousel() {
  return (
    <section className="w-full bg-white px-4 py-4 sm:px-6 lg:px-8">
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent>
          {bannerSlides.map((slide, index) => (
            <CarouselItem key={slide.src}>
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
