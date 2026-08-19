import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2B2320] text-[#FBF6F2]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-xl mb-4 text-[#C9A25D]">Guzel Meraki</p>
          <p className="text-sm text-[#FBF6F2]/55 leading-relaxed">
            Decor and event design crafted with intention, based near Kohinoor City, Faisalabad.
          </p>
        </div>

        <div>
          <p className="font-display text-sm mb-4 tracking-wide">Explore</p>
          <ul className="space-y-2.5 text-sm text-[#FBF6F2]/60">
            <li><Link href="/shop" className="hover:text-[#FBF6F2] transition-colors">Shop</Link></li>
            <li><Link href="/events" className="hover:text-[#FBF6F2] transition-colors">Event Decor</Link></li>
            <li><Link href="/about" className="hover:text-[#FBF6F2] transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[#FBF6F2] transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm mb-4 tracking-wide">Contact</p>
          <ul className="space-y-3 text-sm text-[#FBF6F2]/60">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0" />
              Near Kohinoor City, Faisalabad
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} /> +92 300 1234567
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} /> hello@guzelmeraki.com
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm mb-4 tracking-wide">Follow</p>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 rounded-full border border-[#FBF6F2]/20 flex items-center justify-center hover:border-[#C9A25D] hover:text-[#C9A25D] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-[#FBF6F2]/20 flex items-center justify-center hover:border-[#C9A25D] hover:text-[#C9A25D] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#FBF6F2]/10 py-6 text-center text-xs text-[#FBF6F2]/40">
        &copy; 2026 Guzel Meraki Studio. All rights reserved.
      </div>
    </footer>
  );
}
