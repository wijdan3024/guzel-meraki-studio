"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function PaymentPendingPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-3xl p-10 text-center shadow-sm border border-[#6B1F3D]/08">
        <div className="w-20 h-20 rounded-full bg-[#6B1F3D]/10 flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={36} className="text-[#6B1F3D]" />
        </div>

        <h1 className="font-display text-3xl text-[#2B2320] mb-3">
          Payment Request Received
        </h1>

        <p className="text-[#2B2320]/60 mb-2">
          Thank you! Your order has been placed successfully.
        </p>

        {orderNumber && (
          <p className="text-sm text-[#2B2320]/50 mb-8">
            Order Number:{" "}
            <span className="font-medium text-[#6B1F3D]">{orderNumber}</span>
          </p>
        )}

        <div className="bg-[#FBF6F2] rounded-2xl p-5 mb-8 text-left text-sm text-[#2B2320]/70">
          <p className="mb-2">• We have received your payment request.</p>
          <p className="mb-2">• Our team will confirm the payment shortly.</p>
          <p>• You will receive an update on your email / WhatsApp.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="btn-primary">
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
          <Link href="/" className="btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}