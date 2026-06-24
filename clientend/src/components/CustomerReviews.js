"use client";

import { useEffect, useState } from "react";

import Container from "@/components/Container";
import { apiRequest } from "@/lib/api";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let alive = true;

    apiRequest("/reviews/get-reviews")
      .then((data) => {
        if (!alive) return;

        const nextReviews = (data.reviews || []).slice(0, 3).map((review) => ({
          name: review.customerName,
          location: review.product?.name || "Verified buyer",
          rating: Number(review.rating || 0).toFixed(1),
          text: review.comment,
        }));

        setReviews(nextReviews);
      })
      .catch(() => {
        if (alive) setReviews([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  if (!reviews.length) {
    return null;
  }

  return (
    <section className="bg-[#fbf7f1]">
      <Container>
        <div className="py-16 lg:py-24">
          <div className="text-center">
            <h2 className="text-4xl font-black leading-tight text-main sm:text-5xl lg:text-6xl">
              Customer reviews
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviews.map(({ name, location, rating, text }) => (
              <article
                key={`${name}-${location}`}
                className="rounded-lg border border-neutral-200 bg-white p-7 shadow-[0_16px_45px_rgba(23,63,49,0.08)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-main">{name}</h3>
                    <p className="mt-1 text-sm font-medium text-main/60">{location}</p>
                  </div>
                  <span className="rounded-full bg-accentSoft px-3 py-1 text-sm font-black text-main">
                    {rating}
                  </span>
                </div>

                <div className="mt-6 flex gap-1 text-xl text-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index}>★</span>
                  ))}
                </div>

                <p className="mt-5 text-base font-medium leading-7 text-main/70">
                  "{text}"
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
