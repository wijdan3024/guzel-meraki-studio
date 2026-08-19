"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Variant {
  id: string;
  name: string;
  value: string;
  priceModifier: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: { name: string };
  variants: Variant[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const finalPrice = product.price + (selectedVariant?.priceModifier ?? 0);
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      variantLabel: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined,
      price: finalPrice,
      image: product.images?.[0],
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 md:px-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        {/* ---- Image ---- */}
        <div className="aspect-[4/5] rounded-3xl overflow-hidden relative">
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#6B1F3D] via-[#7d2748] to-[#C9A25D] flex items-center justify-center">
              <p className="font-display text-2xl text-white/70 tracking-wide">Guzel Meraki</p>
            </div>
          )}
        </div>

        {/* ---- Details ---- */}
        <div>
          <p className="text-xs tracking-[0.25em] text-[#C9A25D] uppercase mb-3">
            {product.category.name}
          </p>
          <h1 className="font-display text-4xl text-[#2B2320] mb-4">{product.name}</h1>
          <p className="text-2xl text-[#6B1F3D] font-display mb-6">
            Rs. {finalPrice.toLocaleString()}
          </p>
          <div className="gold-divider mb-6" />
          <p className="text-[#2B2320]/65 leading-relaxed mb-8">{product.description}</p>

          {/* ---- Variants ---- */}
          {product.variants.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-[#2B2320]/70 mb-3">{product.variants[0].name}</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      selectedVariant?.id === v.id
                        ? "bg-[#6B1F3D] text-white border-[#6B1F3D]"
                        : "border-[#6B1F3D]/20 text-[#2B2320]/70 hover:border-[#6B1F3D]/50"
                    }`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---- Quantity ---- */}
          <div className="mb-8">
            <p className="text-sm text-[#2B2320]/70 mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full border border-[#6B1F3D]/20 flex items-center justify-center hover:bg-[#6B1F3D]/5"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                className="w-9 h-9 rounded-full border border-[#6B1F3D]/20 flex items-center justify-center hover:bg-[#6B1F3D]/5"
              >
                <Plus size={14} />
              </button>
              <span className="text-xs text-[#2B2320]/40">{availableStock} in stock</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              disabled={availableStock === 0}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#6B1F3D] text-white hover:bg-[#571831] transition-colors disabled:opacity-40"
            >
              <ShoppingBag size={16} />
              {added ? "Added to cart!" : availableStock === 0 ? "Out of stock" : "Add to Cart"}
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                router.push("/cart");
              }}
              disabled={availableStock === 0}
              className="px-8 py-3.5 rounded-full border border-[#6B1F3D]/25 text-[#6B1F3D] hover:bg-[#6B1F3D]/5 transition-colors disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
