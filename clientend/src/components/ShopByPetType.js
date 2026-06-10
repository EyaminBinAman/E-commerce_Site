import Link from "next/link";

import Container from "@/components/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const categories = [
  {
    name: "Dogs",
    description: "Food, toys, beds, meds",
    icon: "🐶",
    href: "/categories/dogs",
  },
  {
    name: "Cats",
    description: "Litter, food, trees, toys",
    icon: "🐱",
    href: "/categories/cats",
  },
  {
    name: "Fish",
    description: "Food, tanks, filters, care",
    icon: "🐠",
    href: "/categories/fish",
  },
  {
    name: "Birds",
    description: "Cages, food, perches, toys",
    icon: "🦜",
    href: "/categories/birds",
  },
  {
    name: "Small Pets",
    description: "Hay, bedding, habitats",
    icon: "🐹",
    href: "/categories/small-pets",
  },
  {
    name: "Pharmacy",
    description: "Health, prevention, vitamins",
    icon: "💊",
    href: "/categories/pharmacy",
  },
];

export default function ShopByPetType() {
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
              {categories.map(({ name, description, icon, href }) => (
                <CarouselItem
                  key={name}
                  className="basis-[82%] pl-5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/6"
                >
                  <Link
                    href={href}
                    className="group flex min-h-52 flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 text-center shadow-[0_16px_45px_rgba(23,63,49,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-main/30 hover:shadow-[0_20px_55px_rgba(23,63,49,0.14)]"
                  >
                    <span className="text-4xl leading-none transition-transform duration-300 group-hover:scale-110">
                      {icon}
                    </span>
                    <h3 className="mt-6 text-xl font-black text-main">
                      {name}
                    </h3>
                    <p className="mt-3 text-sm font-medium leading-6 text-main/65">
                      {description}
                    </p>
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
