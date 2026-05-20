import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { HiOutlineEnvelope } from "react-icons/hi2";

import Container from "@/components/Container";

const shopLinks = ["Dogs", "Cats", "Fish", "Birds"];
const usefulLinks = ["Best Sellers", "New Arrivals", "Brands", "Pet Care"];
const supportLinks = ["Track Order", "Contact", "FAQ", "My Account"];

const socialLinks = [
  { icon: FaFacebookF, href: "/", label: "Facebook" },
  { icon: FaInstagram, href: "/", label: "Instagram" },
  { icon: FaYoutube, href: "/", label: "YouTube" },
  { icon: HiOutlineEnvelope, href: "/", label: "Email" },
];

const renderLinks = (items) =>
  items.map((item) => (
    <li key={item}>
      <Link
        href="/"
        className="text-[1.05rem] text-white/80 transition-colors duration-300 hover:text-white"
      >
        {item}
      </Link>
    </li>
  ));

export default function Footer() {
  return (
    <footer className="bg-main text-white">
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-end gap-0.5">
              <span className="text-[3rem] font-black tracking-[-0.05em] text-white">
                Paw
              </span>
              <span className="text-[3rem] font-black tracking-[-0.05em] text-accent">
                Tail
              </span>
            </Link>

            <p className="mt-5 text-[1.05rem] leading-8 text-white/80">
              Pet-first browsing, relevant products only, and a warm shopping
              experience for every pet parent.
            </p>

            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  <Icon className="text-sm" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold">Shop</h3>
            <ul className="mt-5 space-y-3">{renderLinks(shopLinks)}</ul>
          </div>

          <div>
            <h3 className="text-xl font-bold">Useful</h3>
            <ul className="mt-5 space-y-3">{renderLinks(usefulLinks)}</ul>
          </div>

          <div>
            <h3 className="text-xl font-bold">Support</h3>
            <ul className="mt-5 space-y-3">{renderLinks(supportLinks)}</ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 py-6 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 PawTail. All rights reserved.</p>

          <div className="flex items-center gap-2">
            <Link href="/" className="transition-colors duration-300 hover:text-white">
              Privacy
            </Link>
            <span>&middot;</span>
            <Link href="/" className="transition-colors duration-300 hover:text-white">
              Terms
            </Link>
            <span>&middot;</span>
            <Link href="/" className="transition-colors duration-300 hover:text-white">
              Sitemap
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
