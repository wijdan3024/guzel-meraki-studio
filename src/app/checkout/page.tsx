"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          ...form,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      // ---- Initiate payment with Safepay and redirect to their Checkout page ----
      const paymentRes = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.data.id }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentData.success) {
        setError(paymentData.message || "Could not start payment. Please try again.");
        setLoading(false);
        return;
      }

      clearCart();
      window.location.href = paymentData.data.checkoutUrl;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 text-center">
        <p className="text-[#2B2320]/50">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 md:px-10">
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white rounded-2xl p-8 space-y-5">
          <h1 className="font-display text-2xl text-[#2B2320] mb-2">Delivery Details</h1>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>
          )}

          <input
            type="text"
            required
            placeholder="Full name"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D]"
          />
          <input
            type="email"
            required
            placeholder="Email address"
            value={form.customerEmail}
            onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D]"
          />
          <input
            type="tel"
            required
            placeholder="Phone number"
            value={form.customerPhone}
            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D]"
          />
          <textarea
            required
            rows={3}
            placeholder="Delivery address"
            value={form.deliveryAddress}
            onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D] resize-none"
          />
          <textarea
            rows={2}
            placeholder="Order notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D] resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#6B1F3D] text-white hover:bg-[#571831] transition-colors disabled:opacity-60"
          >
            {loading ? "Placing order..." : "Continue to Payment"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="bg-white rounded-2xl p-7 h-fit">
          <p className="font-display text-lg mb-5">Order Summary</p>
          <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId ?? "default"}`}
                className="flex justify-between text-sm"
              >
                <span className="text-[#2B2320]/70">
                  {item.name} × {item.quantity}
                </span>
                <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-display text-lg pt-4 border-t border-[#6B1F3D]/10">
            <span>Total</span>
            <span className="text-[#6B1F3D]">Rs. {totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
