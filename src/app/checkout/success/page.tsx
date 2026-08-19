import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { order } = await searchParams;

  return (
    <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
      <CheckCircle2 size={48} className="text-[#6B1F3D] mb-5" />
      <h1 className="font-display text-3xl text-[#2B2320] mb-3">Order Received</h1>
      {order && (
        <p className="text-[#2B2320]/60 mb-2">
          Reference: <span className="font-medium text-[#6B1F3D]">{order}</span>
        </p>
      )}
      <p className="text-[#2B2320]/50 max-w-md mb-8">
        Your order has been placed and is pending payment confirmation.
        Payment gateway integration is coming in the next stage of the project.
      </p>
      <Link
        href="/shop"
        className="px-8 py-3.5 rounded-full bg-[#6B1F3D] text-white hover:bg-[#571831] transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
