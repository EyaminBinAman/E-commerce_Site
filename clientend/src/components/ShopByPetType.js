"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import Container from "@/components/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { apiRequest } from "@/lib/api";
import { getAssetOrigin } from "@/lib/bannerApi";

const iconBySlug = {
  dog: "🐶",
  dogs: "🐶",
  cat: "🐱",
  cats: "🐱",
  fish: "🐠",
  bird: "🦜",
  birds: "🦜",
  rabbit: "🐹",
  "small-pets": "🐹",
};

export default function ShopByPetType() {
  const [animals, setAnimals] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let alive = true;

    Promise.all([
      apiRequest("/animals/get-animals").catch(() => ({ animals: [] })),
      apiRequest("/categories/get-categories").catch(() => ({ categories: [] })),
    ]).then(([animalData, categoryData]) => {
      if (!alive) return;
      setAnimals(animalData.animals || []);
      setCategories(categoryData.categories || []);
    });

    return () => {
      alive = false;
    };
  }, []);

  const cards = useMemo(() => {
    return animals.map((animal) => {
      const relatedCategories = categories.filter(
        (category) =>
          category.animalName?.toLowerCase() === animal.name?.toLowerCase()
      );

      return {
        name: animal.name,
        description:
          relatedCategories.slice(0, 3).map((item) => item.name).join(", ") || "",
        icon: iconBySlug[animal.slug] || "🐾",
        image: animal.image || null,
        href: `/categories/${animal.slug}`,
      };
    });
  }, [animals, categories]);

  if (!cards.length) {
    return null;
  }

  return (
    <section className="bg-[#fbf7f1]">
      <Container>
        <div className="py-16 lg:py-24">
          <div className="text-center">
            <h2 className="text-4xl font-black leading-tight text-main sm:text-5xl lg:text-6xl">
              Shop by category
            </h2>
          </div>

          <Carousel
            opts={{ align: "start", loop: true }}
            className="mt-10 sm:px-14"
            aria-label="Shop by category"
          >
            <CarouselContent className="-ml-5">
              {cards.map(({ name, description, icon, image, href }) => (
                <CarouselItem
                  key={name}
                  className="basis-[82%] pl-5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/6"
                >
                  <Link
                    href={href}
                    className="group flex min-h-52 flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 text-center shadow-[0_16px_45px_rgba(23,63,49,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-main/30 hover:shadow-[0_20px_55px_rgba(23,63,49,0.14)]"
                  >
                    <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-mainSoft transition-transform duration-300 group-hover:scale-110">
                      {image ? (
                        <Image
                          src={image.startsWith("http") ? image : `${getAssetOrigin()}${image.startsWith("/") ? image : `/${image}`}`}
                          alt={name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl leading-none">{icon}</span>
                      )}
                    </span>
                    <h3 className="mt-6 text-xl font-black text-main">{name}</h3>
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
