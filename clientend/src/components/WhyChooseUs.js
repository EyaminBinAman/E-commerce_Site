import {
  HiBolt,
  HiCurrencyDollar,
  HiMapPin,
  HiShieldCheck,
  HiTruck,
} from "react-icons/hi2";
import { BiSupport } from "react-icons/bi";

import Container from "@/components/Container";

const benefits = [
  {
    title: "1 Day Delivery",
    description: "Fast delivery within 24 hours",
    icon: HiTruck,
    iconClassName: "text-blue-600",
    cardClassName: "bg-blue-50",
  },
  {
    title: "Instant Delivery",
    description: "Same day delivery available",
    icon: HiBolt,
    iconClassName: "text-amber-600",
    cardClassName: "bg-amber-50",
  },
  {
    title: "Lower Prices",
    description: "Best prices guaranteed",
    icon: HiCurrencyDollar,
    iconClassName: "text-emerald-600",
    cardClassName: "bg-emerald-50",
  },
  {
    title: "Outside Dhaka",
    description: "Nationwide delivery coverage",
    icon: HiMapPin,
    iconClassName: "text-purple-600",
    cardClassName: "bg-purple-50",
  },
  {
    title: "Secure Payment",
    description: "100% secure transactions",
    icon: HiShieldCheck,
    iconClassName: "text-red-600",
    cardClassName: "bg-red-50",
  },
  {
    title: "24/7 Support",
    description: "Always here to help you",
    icon: BiSupport,
    iconClassName: "text-indigo-600",
    cardClassName: "bg-indigo-50",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-16 lg:py-24">
          <h2 className="text-center text-3xl font-black leading-tight text-neutral-950 sm:text-4xl">
            Why Choose Us
          </h2>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(
              ({
                title,
                description,
                icon: Icon,
                iconClassName,
                cardClassName,
              }) => (
                <div
                  key={title}
                  className={`${cardClassName} rounded-lg p-7 shadow-sm`}
                >
                  <Icon className={`text-4xl ${iconClassName}`} />
                  <h3 className="mt-8 text-xl font-black text-neutral-950">
                    {title}
                  </h3>
                  <p className="mt-4 text-base font-medium text-neutral-500">
                    {description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
