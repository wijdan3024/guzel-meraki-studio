"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <ShoppingBag size={40} className="text-[#6B1F3D]/20 mb-4" />
        <p className="font-display text-2xl text-[#2B2320] mb-2">Your cart is empty</p>
        <p className="text-[#2B2320]/50 mb-8">Discover pieces that make an occasion feel intentional.</p>
        <Link
          href="/shop"
          className="px-8 py-3.5 rounded-full bg-[#6B1F3D] text-white hover:bg-[#571831] transition-colors"
        >
          Browse the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl text-[#2B2320] mb-10">Your Cart</h1>

        <div className="grid md:grid-cols-3 gap-10">
          {/* ---- Items ---- */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId ?? "default"}`}
                className="bg-white rounded-2xl p-5 flex items-center gap-5"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#6B1F3D] to-[#C9A25D]" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-display text-lg text-[#2B2320]">{item.name}</p>
                  {item.variantLabel && (
                    <p className="text-xs text-[#2B2320]/50">{item.variantLabel}</p>
                  )}
                  <p className="text-sm text-[#6B1F3D] mt-1">Rs. {item.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1, item.variantId)
                    }
                    className="w-7 h-7 rounded-full border border-[#6B1F3D]/20 flex items-center justify-center hover:bg-[#6B1F3D]/5"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-5 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1, item.variantId)
                    }
                    className="w-7 h-7 rounded-full border border-[#6B1F3D]/20 flex items-center justify-center hover:bg-[#6B1F3D]/5"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="text-[#2B2320]/30 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          {/* ---- Summary ---- */}
          <div className="bg-white rounded-2xl p-7 h-fit">
            <p className="font-display text-xl mb-6">Order Summary</p>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#2B2320]/60">Subtotal</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-6 pb-6 border-b border-[#6B1F3D]/10">
              <span className="text-[#2B2320]/60">Delivery</span>
              <span className="text-[#2B2320]/50">Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-display text-lg mb-6">
              <span>Total</span>
              <span className="text-[#6B1F3D]">Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#6B1F3D] text-white hover:bg-[#571831] transition-colors"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
