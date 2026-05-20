import Link from "next/link";

import Container from "@/components/Container";

const navLinks = [
  "Home",
  "Categories",
  "Brands",
  "Contact",
];

export default function Navbar() {
  return (
    <div className="bg-main text-white">
      <Container className="text-center">
        <div className="flex min-h-13 items-center justify-center py-3 lg:py-0">
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base font-semibold">
            {navLinks.map((item) => (
              <Link
                key={item}
                href="/"
                className="relative transition-opacity duration-300 hover:opacity-80"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </div>
  );
}
