"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/events", label: "Event Decor" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#FBF6F2]/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-wide text-[#6B1F3D]">
          Guzel Meraki
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-[#2B2320]/70 hover:text-[#6B1F3D] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-5">
          <Link href="/account" className="text-[#2B2320]/70 hover:text-[#6B1F3D] transition-colors">
            <User size={19} strokeWidth={1.5} />
          </Link>
          <Link href="/cart" className="relative text-[#2B2320]/70 hover:text-[#6B1F3D] transition-colors">
            <ShoppingBag size={19} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#6B1F3D] text-white text-[10px] flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        <button
          className="md:hidden text-[#6B1F3D]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#FBF6F2] border-t border-[#6B1F3D]/10 px-6 py-6 flex flex-col gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#2B2320]/70"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-5 pt-3 border-t border-[#6B1F3D]/10">
            <Link href="/account" className="text-[#6B1F3D]">
              <User size={19} strokeWidth={1.5} />
            </Link>
            <Link href="/cart" className="text-[#6B1F3D]">
              <ShoppingBag size={19} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
