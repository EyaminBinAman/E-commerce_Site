import Link from "next/link";

import Container from "@/components/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const brands = [
  {
    name: "Orijen",
    description: "Dog & cat nutrition",
  },
  {
    name: "Royal Canin",
    description: "Breed-focused formulas",
  },
  {
    name: "KONG",
    description: "Chew and play",
  },
  {
    name: "Fluval",
    description: "Aquarium gear",
  },
  {
    name: "Oxbow",
    description: "Small pet care",
  },
  {
    name: "NexGard",
    description: "Preventive care",
  },
];

export default function PopularBrands() {
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
              {brands.map(({ name, description }) => (
                <CarouselItem
                  key={name}
                  className="basis-[82%] pl-5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/6"
                >
                  <Link
                    href="/"
                    className="group flex min-h-36 flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 text-center shadow-[0_16px_45px_rgba(23,63,49,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-main/30 hover:shadow-[0_20px_55px_rgba(23,63,49,0.14)]"
                  >
                    <h3 className="text-xl font-black text-main">{name}</h3>
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
