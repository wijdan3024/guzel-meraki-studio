"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  CreditCard,
  User,
  Phone,
  MapPin,
} from "lucide-react";

function PaymentReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumber = searchParams.get("order") || "";
  const amount = searchParams.get("amount") || "0";
  const name = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "";
  const email = searchParams.get("email") || "";
  const address = searchParams.get("address") || "";

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);

    // Yahan baad mein real payment gateway call ho sakti hai
    // Abhi seedha pending page pe bhej rahe hain
    setTimeout(() => {
      router.push(`/checkout/pending?order=${orderNumber}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-[#C9A25D] text-xs tracking-[0.25em] uppercase mb-2">
            Review Payment
          </p>

          <h1 className="font-display text-3xl text-[#2B2320]">
            Confirm Your Payment
          </h1>
        </div>

        <div className="bg-white rounded-3xl border border-[#6B1F3D]/08 shadow-sm overflow-hidden">
          {/* Amount Banner */}
          <div className="bg-[#1A1210] px-8 py-8 text-center">
            <p className="text-[#FBF6F2]/50 text-sm mb-1">
              Total Amount
            </p>

            <p className="font-display text-4xl text-[#FBF6F2]">
              Rs. {Number(amount).toLocaleString()}
            </p>

            {orderNumber && (
              <p className="text-[#C9A25D] text-sm mt-2">
                Order #{orderNumber}
              </p>
            )}
          </div>

          {/* Details */}
          <div className="p-8 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#6B1F3D]/10 flex items-center justify-center text-[#6B1F3D] shrink-0">
                <User size={18} />
              </div>

              <div>
                <p className="text-xs text-[#2B2320]/40 uppercase tracking-wider">
                  Customer
                </p>

                <p className="font-medium">
                  {name || "—"}
                </p>

                <p className="text-sm text-[#2B2320]/50">
                  {email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#6B1F3D]/10 flex items-center justify-center text-[#6B1F3D] shrink-0">
                <Phone size={18} />
              </div>

              <div>
                <p className="text-xs text-[#2B2320]/40 uppercase tracking-wider">
                  Phone
                </p>

                <p className="font-medium">
                  {phone || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#6B1F3D]/10 flex items-center justify-center text-[#6B1F3D] shrink-0">
                <MapPin size={18} />
              </div>

              <div>
                <p className="text-xs text-[#2B2320]/40 uppercase tracking-wider">
                  Delivery Address
                </p>

                <p className="font-medium text-sm leading-relaxed">
                  {address || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-2 border-t border-[#6B1F3D]/08">
              <div className="w-10 h-10 rounded-full bg-[#6B1F3D]/10 flex items-center justify-center text-[#6B1F3D] shrink-0">
                <CreditCard size={18} />
              </div>

              <div>
                <p className="text-xs text-[#2B2320]/40 uppercase tracking-wider">
                  Payment Method
                </p>

                <p className="font-medium">
                  Safepay (Card / JazzCash / Easypaisa)
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="px-8 pb-8 space-y-3">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? "Processing..." : "Confirm & Pay"}

              {!loading && <ArrowRight size={16} />}
            </button>

            <button
              onClick={() => router.back()}
              className="w-full py-3 text-sm text-[#2B2320]/50 hover:text-[#6B1F3D] transition-colors"
            >
              ← Go Back & Edit Details
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#2B2320]/40 mt-6">
          By confirming you agree to our terms of service
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#6B1F3D]">
          Loading payment details...
        </p>
      </div>
    </div>
  );
}

export default function PaymentReviewPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PaymentReviewContent />
    </Suspense>
  );
}