import Link from "next/link";
import { XCircle } from "lucide-react";

interface CancelledPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutCancelledPage({ searchParams }: CancelledPageProps) {
  const { order } = await searchParams;

  return (
    <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
      <XCircle size={48} className="text-[#2B2320]/30 mb-5" />
      <h1 className="font-display text-3xl text-[#2B2320] mb-3">Payment Cancelled</h1>
      {order && (
        <p className="text-[#2B2320]/50 mb-2">
          Order reference: <span className="font-medium">{order}</span>
        </p>
      )}
      <p className="text-[#2B2320]/50 max-w-md mb-8">
        Your payment was not completed. Your order has been saved — you can try
        paying again from your account, or reach out if you need help.
      </p>
      <Link
        href="/shop"
        className="px-8 py-3.5 rounded-full bg-[#6B1F3D] text-white hover:bg-[#571831] transition-colors"
      >
        Return to Shop
      </Link>
    </div>
  );
}
