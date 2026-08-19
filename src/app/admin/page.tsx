import { prisma } from "@/lib/prisma";
import { ShoppingBag, Package, MessageSquareHeart, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  const [orderCount, productCount, enquiryCount, orders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.eventEnquiry.count({ where: { status: "NEW" } }),
    prisma.order.findMany({
      where: { status: "PAID" },
      select: { totalAmount: true },
    }),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const recentOrders = await prisma.order.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  const stats = [
    { label: "Total Orders", value: orderCount, icon: ShoppingBag, color: "from-[#6B1F3D] to-[#7d2748]" },
    { label: "Products Listed", value: productCount, icon: Package, color: "from-[#C9A25D] to-[#b8924f]" },
    { label: "New Enquiries", value: enquiryCount, icon: MessageSquareHeart, color: "from-[#6B1F3D] to-[#7d2748]" },
    { label: "Revenue (Paid)", value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-[#C9A25D] to-[#b8924f]" },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    PAID: "bg-emerald-100 text-emerald-700",
    FAILED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-500",
    SHIPPED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-[#6B1F3D]/10 text-[#6B1F3D]",
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm tracking-widest text-[#C9A25D] font-semibold mb-2 uppercase">Overview</p>
        <h1 className="font-display text-3xl text-[#2B2320]">Dashboard</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
              <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-2xl font-display text-[#2B2320] mb-1">{value}</p>
            <p className="text-sm text-[#2B2320]/55">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="font-display text-xl mb-6">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-[#2B2320]/50">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl border border-[#6B1F3D]/8">
                <div>
                  <p className="font-medium text-sm">{order.customerName}</p>
                  <p className="text-xs text-[#2B2320]/50">
                    {order.orderNumber} · Rs. {Number(order.totalAmount).toLocaleString()}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
