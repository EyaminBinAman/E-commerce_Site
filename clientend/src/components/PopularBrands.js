"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Container from "@/components/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { apiRequest } from "@/lib/api";
import { resolveCatalogImageUrl } from "@/lib/categoryApi";

function BrandInitials({ name }) {
  return (
    <span className="text-lg font-black text-main">
      {(name || "?")
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()}
    </span>
  );
}

export default function PopularBrands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    let alive = true;

    apiRequest("/brands/get-brands")
      .then((data) => {
        if (!alive) return;

        const nextBrands = (data.brands || []).slice(0, 6).map((brand) => ({
          name: brand.name,
          slug: brand.slug || String(brand.name || "").trim().toLowerCase().replace(/\s+/g, "-"),
          description: Array.isArray(brand.animalNames) && brand.animalNames.length
            ? brand.animalNames.join(", ")
            : "",
          imageUrl: resolveCatalogImageUrl(brand.image),
        }));

        setBrands(nextBrands);
      })
      .catch(() => {
        if (alive) setBrands([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  if (!brands.length) {
    return null;
  }

  return (
    <section className="bg-[#eef8f2]">
      <Container>
        <div className="py-16 lg:py-24">
          <div className="text-center">
            <h2 className="text-4xl font-black leading-tight text-main sm:text-5xl lg:text-6xl">
              Popular brands
            </h2>
          </div>

          <Carousel
            opts={{ align: "start", loop: true }}
            className="mt-10 sm:px-14"
            aria-label="Popular brands"
          >
            <CarouselContent className="-ml-5">
              {brands.map(({ name, description, slug, imageUrl }) => (
                <CarouselItem
                  key={slug}
                  className="basis-[82%] pl-5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/6"
                >
                  <Link
                    href={`/brands/${slug}`}
                    className="group flex min-h-36 flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 py-6 text-center shadow-[0_16px_45px_rgba(23,63,49,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-main/30 hover:shadow-[0_20px_55px_rgba(23,63,49,0.14)]"
                  >
                    <span className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-[#eef8f2]">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={name}
                          width={56}
                          height={56}
                          unoptimized
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <BrandInitials name={name} />
                      )}
                    </span>
                    <h3 className="text-xl font-black text-main">{name}</h3>
                    {description ? (
                      <p className="mt-3 text-sm font-medium leading-6 text-main/65">
                        {description}
                      </p>
                    ) : null}
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden h-11 w-11 sm:flex sm:left-0" />
            <CarouselNext className="hidden h-11 w-11 sm:flex sm:right-0" />
          </Carousel>
        </div>
      </Container>
    </section>
  );
}
