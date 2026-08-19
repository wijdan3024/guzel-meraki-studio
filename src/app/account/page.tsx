import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Package,
  LogOut,
  User as UserIcon,
  Mail,
  Phone,
} from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-[#6B1F3D]/10 text-[#6B1F3D]",
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const authUser = token ? verifyToken(token) : null;

  if (!authUser) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: authUser.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-sm tracking-widest text-[#C9A25D] font-semibold mb-2 uppercase">
            My Account
          </p>

          <h1 className="font-display text-3xl text-[#2B2320]">
            Welcome, {user.name.split(" ")[0]}
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* ---- Profile ---- */}
          <div className="bg-white rounded-3xl p-7 h-fit">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6B1F3D] to-[#C9A25D] flex items-center justify-center text-white font-display text-xl mb-5">
              {user.name.charAt(0)}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <UserIcon size={16} className="text-[#6B1F3D]" />
                <p className="text-sm">{user.name}</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#6B1F3D]" />
                <p className="text-sm">{user.email}</p>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#6B1F3D]" />
                  <p className="text-sm">{user.phone}</p>
                </div>
              )}
            </div>

            <a
              href="/api/auth/logout"
              className="flex items-center gap-2 w-full justify-center py-2.5 rounded-full border border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              Log out
            </a>
          </div>

          {/* ---- Orders ---- */}
          <div className="md:col-span-2 bg-white rounded-3xl p-7">
            <h2 className="font-display text-xl mb-6">My Orders</h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-9 h-9 text-[#6B1F3D]/20 mx-auto mb-3" />

                <p className="text-[#2B2320]/50 mb-4">
                  You haven&apos;t placed any orders yet.
                </p>

                <a
                  href="/shop"
                  className="text-sm text-[#6B1F3D] hover:underline"
                >
                  Browse the collection →
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-[#6B1F3D]/8 rounded-2xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm">
                          {order.orderNumber}
                        </p>

                        <p className="text-xs text-[#2B2320]/45">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${
                          statusColors[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-1 mb-2">
                      {order.items.map((item) => (
                        <p
                          key={item.id}
                          className="text-xs text-[#2B2320]/60"
                        >
                          {item.product.name} × {item.quantity}
                        </p>
                      ))}
                    </div>

                    <p className="text-sm font-medium text-[#6B1F3D]">
                      Rs. {Number(order.totalAmount).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}