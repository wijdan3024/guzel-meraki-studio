"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  createdAt: string;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-[#6B1F3D]/10 text-[#6B1F3D]",
};

const statusOptions = ["PENDING", "PAID", "FAILED", "CANCELLED", "SHIPPED", "DELIVERED"];

export default function AdminOrdersClient({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm tracking-widest text-[#C9A25D] font-semibold mb-2 uppercase">Manage</p>
        <h1 className="font-display text-3xl text-[#2B2320]">Orders</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["ALL", ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs capitalize transition-colors ${
              filter === s ? "bg-[#6B1F3D] text-white" : "bg-white text-[#2B2320]/60 hover:bg-[#6B1F3D]/5"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-[#2B2320]/50">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-display text-lg">{order.customerName}</p>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#2B2320]/50">
                    {order.orderNumber} · {order.customerEmail} · {order.customerPhone}
                  </p>
                  <p className="text-xs text-[#2B2320]/40 mt-1">{order.deliveryAddress}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  disabled={updatingId === order.id}
                  className="text-sm px-4 py-2 rounded-xl border border-[#6B1F3D]/15 bg-white"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-[#6B1F3D]/8 pt-4 space-y-1.5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-[#2B2320]/65">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-[#6B1F3D]/8">
                  <span>Total</span>
                  <span className="text-[#6B1F3D]">Rs. {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
