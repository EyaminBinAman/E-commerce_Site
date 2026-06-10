import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { HiEnvelope, HiMapPin, HiPhone } from "react-icons/hi2";

import Container from "@/components/Container";

const quickLinks = ["About Us", "Contact Us", "My Profile", "Order History"];
const policyLinks = [
  "Privacy Policy",
  "Terms & Conditions",
  "Return Policy",
  "Shipping Policy",
  "FAQ",
];

const socialLinks = [
  { icon: FaFacebookF, href: "/", label: "Facebook" },
  { icon: FaInstagram, href: "/", label: "Instagram" },
  { icon: FaTwitter, href: "/", label: "Twitter" },
  { icon: FaYoutube, href: "/", label: "YouTube" },
];

const renderLinks = (items) =>
  items.map((item) => (
    <li key={item}>
      <Link
        href="/"
        className="text-base font-semibold text-white/75 transition-colors duration-300 hover:text-white"
      >
        {item}
      </Link>
    </li>
  ));

export default function Footer() {
  return (
    <footer className="bg-main text-white">
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-[1.25fr_1fr_1fr_1.35fr]">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white">
                Logo
              </span>
              <span className="text-2xl font-black text-white">PawTail</span>
            </Link>

            <p className="mt-7 max-w-sm text-base font-semibold leading-8 text-white/75">
              Your trusted partner for all pet care needs. We provide quality
              products and services to keep your pets happy and healthy.
            </p>

            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  <Icon className="text-base" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black">Quick Links</h3>
            <ul className="mt-7 space-y-4">{renderLinks(quickLinks)}</ul>
          </div>

          <div>
            <h3 className="text-xl font-black">Policies</h3>
            <ul className="mt-7 space-y-4">{renderLinks(policyLinks)}</ul>
          </div>

          <div>
            <h3 className="text-xl font-black">Contact Us</h3>
            <ul className="mt-7 space-y-5 text-base font-semibold text-white/75">
              <li className="flex items-start gap-4">
                <HiMapPin className="mt-1 text-lg text-white" />
                <span>123 Pet Street, Gulshan-2, Dhaka-1212, Bangladesh</span>
              </li>
              <li className="flex items-center gap-4">
                <HiPhone className="text-lg text-white" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-4">
                <HiEnvelope className="text-lg text-white" />
                <span>support@petshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-sm font-semibold text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 PawTail. All rights reserved.</p>
          <p>
            Powered by <span className="font-black text-white">PetTech Solutions</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
