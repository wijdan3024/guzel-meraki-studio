import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "ACTIVE",
        ...(category ? { category: { slug: category } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.25em] text-[#C9A25D] uppercase mb-3">
            The Collection
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-[#2B2320]">Shop Decor</h1>
        </div>

        {/* ---- Category filter pills ---- */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          <a
            href="/shop"
            className={`px-5 py-2 rounded-full text-sm transition-colors ${
              !category
                ? "bg-[#6B1F3D] text-[#FBF6F2]"
                : "bg-white text-[#2B2320]/60 hover:bg-[#F0E4DC]"
            }`}
          >
            All
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`px-5 py-2 rounded-full text-sm transition-colors ${
                category === cat.slug
                  ? "bg-[#6B1F3D] text-[#FBF6F2]"
                  : "bg-white text-[#2B2320]/60 hover:bg-[#F0E4DC]"
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>

        {/* ---- Product grid ---- */}
        {products.length === 0 ? (
          <p className="text-center text-[#2B2320]/50 py-20">
            No products found in this category yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, price: Number(product.price) }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
