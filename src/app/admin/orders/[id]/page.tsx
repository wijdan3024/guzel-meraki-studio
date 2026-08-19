import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import OrderStatusForm from "../OrderStatusForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id,
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
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div>
      {/* Back */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-[#6B1F3D] mb-6 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm tracking-widest text-[#C9A25D] font-semibold uppercase mb-2">
          Order Details
        </p>

        <h1 className="font-display text-3xl text-[#2B2320]">
          {order.orderNumber}
        </h1>

        <p className="text-sm text-[#2B2320]/50 mt-2">
          Created{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Customer + Payment */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Customer */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-display text-xl mb-5">
            Customer Information
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-[#2B2320]/40">
                Name
              </p>
              <p className="font-medium">
                {order.customerName}
              </p>
            </div>

            <div>
              <p className="text-[#2B2320]/40">
                Email
              </p>
              <p className="font-medium">
                {order.customerEmail}
              </p>
            </div>

            <div>
              <p className="text-[#2B2320]/40">
                Phone
              </p>
              <p className="font-medium">
                {order.customerPhone}
              </p>
            </div>

            <div>
              <p className="text-[#2B2320]/40">
                Delivery Address
              </p>
              <p className="font-medium">
                {order.deliveryAddress}
              </p>
            </div>

            {order.notes && (
              <div>
                <p className="text-[#2B2320]/40">
                  Notes
                </p>
                <p className="font-medium">
                  {order.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-display text-xl mb-5">
            Payment Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#2B2320]/40">
                Order Total
              </p>

              <p className="text-2xl font-display text-[#6B1F3D]">
                Rs.{" "}
                {Number(
                  order.totalAmount
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#2B2320]/40">
                Order Status
              </p>

              <p className="font-medium">
                {order.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#2B2320]/40">
                Payment Attempts
              </p>

              {order.paymentAttempts.length === 0 ? (
                <p className="text-sm text-[#2B2320]/50 mt-1">
                  No payment attempt recorded.
                </p>
              ) : (
                <div className="space-y-2 mt-2">
                  {order.paymentAttempts.map(
                    (payment) => (
                      <div
                        key={payment.id}
                        className="p-3 rounded-xl bg-[#F5F1EC]"
                      >
                        <p className="text-sm font-medium">
                          Gateway:{" "}
                          {payment.gateway}
                        </p>

                        <p className="text-xs text-[#2B2320]/50 mt-1">
                          Status:{" "}
                          {payment.status}
                        </p>

                        {payment.transactionId && (
                          <p className="text-xs text-[#2B2320]/50 mt-1">
                            Transaction ID:{" "}
                            {payment.transactionId}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="mb-6">
        <OrderStatusForm
          orderId={order.id}
          currentStatus={order.status}
        />
      </div>

      {/* Products */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-display text-xl mb-5">
          Ordered Products
        </h2>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-5 p-4 rounded-xl border border-[#6B1F3D]/10"
            >
              <div>
                <p className="font-medium">
                  {item.product.name}
                </p>

                {item.variant && (
                  <p className="text-xs text-[#2B2320]/50 mt-1">
                    {item.variant.name}:{" "}
                    {item.variant.value}
                  </p>
                )}

                <p className="text-sm text-[#2B2320]/50 mt-1">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="font-medium text-[#6B1F3D]">
                Rs.{" "}
                {(
                  Number(item.price) *
                  item.quantity
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6 pt-5 border-t border-[#6B1F3D]/10">
          <span className="font-display text-lg">
            Total
          </span>

          <span className="font-display text-lg text-[#6B1F3D]">
            Rs.{" "}
            {Number(
              order.totalAmount
            ).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}