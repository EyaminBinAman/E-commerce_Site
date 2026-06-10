"use client";

import useEmblaCarousel from "embla-carousel-react";
import { createContext, useContext, useEffect } from "react";

import { cn } from "@/lib/utils";

const CarouselContext = createContext(null);

export function Carousel({
  opts,
  plugins,
  className = "",
  children,
  setApi,
  ...props
}) {
  const [carouselViewport, api] = useEmblaCarousel(opts, plugins);

  useEffect(() => {
    if (setApi && api) {
      setApi(api);
    }
  }, [api, setApi]);

  return (
    <CarouselContext.Provider value={{ carouselViewport, api }}>
      <div className={cn("relative", className)} role="region" {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ className = "", ...props }) {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("CarouselContent must be used within Carousel");
  }

  return (
    <div
      ref={(node) => {
        context.carouselViewport(node);
      }}
      className="overflow-hidden"
    >
      <div className={cn("flex", className)} {...props} />
    </div>
  );
}

export function CarouselItem({ className = "", ...props }) {
  return (
    <div
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...props}
    />
  );
}

export function CarouselPrevious({ className = "", ...props }) {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("CarouselPrevious must be used within Carousel");
  }

  return (
    <button
      type="button"
      aria-label="Previous slide"
      onClick={() => context.api?.scrollPrev()}
      className={cn(
        "absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white/90 text-2xl font-bold text-main shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/40",
        className
      )}
      {...props}
    >
      ‹
    </button>
  );
}

export function CarouselNext({ className = "", ...props }) {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("CarouselNext must be used within Carousel");
  }

  return (
    <button
      type="button"
      aria-label="Next slide"
      onClick={() => context.api?.scrollNext()}
      className={cn(
        "absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white/90 text-2xl font-bold text-main shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/40",
        className
      )}
      {...props}
    >
      ›
    </button>
  );
}
