import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    images: string[];
    category?: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0];

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#6B1F3D] via-[#7d2748] to-[#C9A25D] group-hover:scale-105 transition-transform duration-500">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />
            <p className="absolute top-5 right-5 font-display text-3xl text-white/20">
              {product.name.charAt(0)}
            </p>
            <p className="absolute bottom-5 left-5 font-display text-sm text-white/70 tracking-wide">
              Guzel Meraki
            </p>
          </div>
        )}
      </div>
      {product.category && (
        <p className="text-xs tracking-widest text-[#C9A25D] uppercase mb-1">
          {product.category.name}
        </p>
      )}
      <h3 className="font-display text-lg text-[#2B2320] mb-1 group-hover:text-[#6B1F3D] transition-colors">
        {product.name}
      </h3>
      <p className="text-sm text-[#2B2320]/60">Rs. {Number(product.price).toLocaleString()}</p>
    </Link>
  );
}
