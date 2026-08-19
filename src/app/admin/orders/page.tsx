import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, ShoppingBag } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-[#6B1F3D]/10 text-[#6B1F3D]",
};

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      paymentAttempts: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm tracking-widest text-[#C9A25D] font-semibold mb-2 uppercase">
          Management
        </p>

        <h1 className="font-display text-3xl text-[#2B2320]">
          Orders
        </h1>

        <p className="text-sm text-[#2B2320]/50 mt-2">
          View and manage all customer orders.
        </p>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag
              size={40}
              className="mx-auto text-[#6B1F3D]/30 mb-4"
            />

            <p className="text-sm text-[#2B2320]/50">
              No orders found.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block p-5 rounded-2xl border border-[#6B1F3D]/10 hover:border-[#6B1F3D]/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between gap-5">
                  {/* Customer */}
                  <div className="min-w-0">
                    <p className="font-medium text-[#2B2320]">
                      {order.customerName}
                    </p>

                    <p className="text-sm text-[#2B2320]/50 mt-1">
                      {order.orderNumber}
                    </p>

                    <p className="text-sm text-[#2B2320]/50">
                      {order.customerEmail}
                    </p>

                    <p className="text-sm text-[#6B1F3D] mt-2 font-medium">
                      Rs.{" "}
                      {Number(order.totalAmount).toLocaleString()}
                    </p>
                  </div>

                  {/* Status + Arrow */}
                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>

                    <ArrowRight
                      size={18}
                      className="text-[#6B1F3D]"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}