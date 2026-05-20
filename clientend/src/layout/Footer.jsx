import Link from "next/link";
import Container from "@/components/Container.jsx";

const shopLinks = [
  { href: "/shop/dogs", label: "Dog essentials" },
  { href: "/shop/cats", label: "Cat favorites" },
  { href: "/shop/food", label: "Premium food" },
  { href: "/shop/grooming", label: "Grooming care" },
];

const usefulLinks = [
  { href: "/about", label: "About us" },
  { href: "/blog", label: "Pet care journal" },
  { href: "/gift-cards", label: "Gift cards" },
  { href: "/stores", label: "Store locator" },
];

const supportLinks = [
  { href: "/contact", label: "Contact support" },
  { href: "/shipping", label: "Shipping details" },
  { href: "/returns", label: "Returns" },
  { href: "/faq", label: "FAQs" },
];

const socialLinks = [
  { href: "/social/facebook", label: "Facebook" },
  { href: "/social/instagram", label: "Instagram" },
  { href: "/social/tiktok", label: "TikTok" },
];

function FooterLink({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-emerald-50/75 transition duration-200 hover:text-orange-300"
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  return (
    <>
      <footer className="w-full bg-emerald-950 py-12 text-emerald-50 sm:py-14 lg:py-16">
        <Container>
          <div className="rounded-lg border border-emerald-100/10 bg-emerald-900/70 p-6 shadow-sm sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">
                Pet perks in your inbox
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Fresh finds, care tips, and member-only treats.
              </h2>
            </div>

            <form className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <input
                type="email"
                placeholder="Email address"
                className="min-h-12 rounded-md border border-emerald-100/20 bg-white px-4 text-sm text-emerald-950 outline-none transition duration-200 placeholder:text-emerald-950/50 focus:border-orange-300 focus:ring-2 focus:ring-orange-300/30"
              />
              <button
                type="submit"
                className="min-h-12 rounded-md bg-orange-400 px-6 text-sm font-semibold text-emerald-950 transition duration-200 hover:bg-orange-300"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-2 lg:grid-cols-4">
            <section>
              <h3 className="text-xl font-semibold text-white">PawTail</h3>
              <p className="mt-4 text-sm leading-6 text-emerald-50/75">
                Premium food, toys, grooming, and daily care essentials for
                pets who deserve the softer side of ecommerce.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md border border-emerald-100/15 px-4 py-2 text-sm font-medium text-emerald-50 transition duration-200 hover:border-orange-300 hover:bg-orange-400 hover:text-emerald-950"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-orange-300">
                Shop
              </h3>
              <ul className="mt-4 space-y-3">
                {shopLinks.map((link) => (
                  <FooterLink key={link.href} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-orange-300">
                Useful links
              </h3>
              <ul className="mt-4 space-y-3">
                {usefulLinks.map((link) => (
                  <FooterLink key={link.href} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-orange-300">
                Support
              </h3>
              <ul className="mt-4 space-y-3">
                {supportLinks.map((link) => (
                  <FooterLink key={link.href} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </section>
          </div>

          <div className="border-t border-emerald-100/10 pt-6 text-sm text-emerald-50/65 sm:flex sm:items-center sm:justify-between">
            <p>Copyright 2026 PawTail. All rights reserved.</p>
            <div className="mt-4 flex gap-5 sm:mt-0">
              <Link
                href="/privacy"
                className="transition duration-200 hover:text-orange-300"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="transition duration-200 hover:text-orange-300"
              >
                Terms
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}
