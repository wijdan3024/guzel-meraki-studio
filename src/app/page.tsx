import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    prisma.category.findMany({ take: 3, orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
  ]);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center px-6 md:px-10 pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5E6E0] via-[#FBF6F2] to-[#F0E4DC]" />
        <div className="absolute -top-20 -right-32 w-[28rem] h-[28rem] bg-[#6B1F3D]/15 rounded-full blur-3xl animate-blob pointer-events-none" />
        <div className="absolute top-1/3 -left-24 w-96 h-96 bg-[#C9A25D]/20 rounded-full blur-3xl animate-blob-delay pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <Sparkles size={15} className="text-[#C9A25D]" />
              <p className="text-xs tracking-[0.25em] text-[#6B1F3D] uppercase">
                Decor &amp; Event Design
              </p>
            </div>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.1] text-[#2B2320] mb-6">
              Every detail,
              <br />
              <span className="text-[#6B1F3D]">designed with meaning.</span>
            </h1>
            <div className="gold-divider mb-6" />
            <p className="text-[#2B2320]/65 text-lg leading-relaxed mb-9 max-w-md">
              Guzel Meraki Studio brings considered, elegant decor to your home
              and your most meaningful celebrations — from weddings to
              intimate gatherings.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#6B1F3D] text-[#FBF6F2] shadow-lg shadow-[#6B1F3D]/25 hover:shadow-xl hover:shadow-[#6B1F3D]/35 hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop the Collection
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#6B1F3D]/25 text-[#6B1F3D] hover:bg-[#6B1F3D]/5 transition-colors"
              >
                Event Decor Services
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#6B1F3D]/20 via-[#C9A25D]/20 to-transparent rounded-[2.5rem] blur-2xl" />
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000"
                alt="Elegant event decor centerpiece"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2320]/40 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#FBF6F2] rounded-2xl px-6 py-4 shadow-2xl animate-float">
              <p className="font-display text-2xl text-[#6B1F3D]">500+</p>
              <p className="text-xs text-[#2B2320]/50 tracking-wide">Events Styled</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      {categories.length > 0 && (
        <Reveal className="px-6 md:px-10 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.25em] text-[#C9A25D] uppercase mb-3">
                Shop by Category
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[#2B2320]">
                Find your aesthetic
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group relative w-full sm:w-[calc(33.333%-1.1rem)] max-w-sm aspect-[4/3] rounded-2xl overflow-hidden flex items-end p-6 shadow-lg shadow-[#2B2320]/5 hover:shadow-2xl hover:shadow-[#6B1F3D]/20 hover:-translate-y-1 transition-all duration-300"
                >
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6B1F3D] via-[#7d2748] to-[#C9A25D] group-hover:scale-105 transition-transform duration-500">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)",
                          backgroundSize: "40px 40px",
                        }}
                      />
                      <p className="absolute top-6 right-6 font-display text-4xl text-white/15">
                        {cat.name.charAt(0)}
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2320]/70 via-[#2B2320]/10 to-transparent" />
                  <div className="relative">
                    <div className="w-8 h-px bg-[#C9A25D] mb-3" />
                    <p className="font-display text-2xl text-[#FBF6F2] group-hover:translate-x-1 transition-transform">
                      {cat.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* ===== DARK STATS BAND ===== */}
      <Reveal className="px-6 md:px-10 py-6">
        <div className="relative max-w-7xl mx-auto bg-gradient-to-br from-[#2B2320] via-[#3a2e28] to-[#2B2320] rounded-3xl px-8 md:px-16 py-14 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#C9A25D]/15 rounded-full blur-3xl animate-blob pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#6B1F3D]/25 rounded-full blur-3xl animate-blob-delay pointer-events-none" />
          <div className="relative grid sm:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-display text-4xl text-[#FBF6F2] mb-1">500+</p>
              <p className="text-xs text-[#FBF6F2]/50 uppercase tracking-wide">Events Styled</p>
            </div>
            <div>
              <p className="font-display text-4xl text-[#C9A25D] mb-1">1,200+</p>
              <p className="text-xs text-[#FBF6F2]/50 uppercase tracking-wide">Pieces Delivered</p>
            </div>
            <div>
              <p className="font-display text-4xl text-[#FBF6F2] mb-1">98%</p>
              <p className="text-xs text-[#FBF6F2]/50 uppercase tracking-wide">Client Satisfaction</p>
            </div>
            <div>
              <p className="font-display text-4xl text-[#C9A25D] mb-1">4.9★</p>
              <p className="text-xs text-[#FBF6F2]/50 uppercase tracking-wide">Average Rating</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ===== FEATURED PRODUCTS ===== */}
      {featuredProducts.length > 0 && (
        <Reveal className="px-6 md:px-10 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-xs tracking-[0.25em] text-[#C9A25D] uppercase mb-3">
                  New Arrivals
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-[#2B2320]">
                  Recently added
                </h2>
              </div>
              <Link href="/shop" className="text-sm text-[#6B1F3D] hover:underline hidden sm:block">
                View all →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, price: Number(product.price) }}
                />
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* ===== CTA ===== */}
      <Reveal className="px-6 md:px-10 py-24">
        <div className="relative max-w-7xl mx-auto bg-gradient-to-br from-[#6B1F3D] via-[#7d2748] to-[#4a1529] rounded-3xl px-8 md:px-16 py-16 text-center overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#C9A25D]/20 rounded-full blur-3xl animate-blob pointer-events-none" />
          <div className="relative">
            <p className="text-xs tracking-[0.25em] text-[#C9A25D] uppercase mb-4">
              Planning an Event?
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-[#FBF6F2] mb-6">
              Let&apos;s design something unforgettable
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C9A25D] text-[#2B2320] font-medium hover:bg-[#b8924f] hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
            >
              Enquire Now
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
