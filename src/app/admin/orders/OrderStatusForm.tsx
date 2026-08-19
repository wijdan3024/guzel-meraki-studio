"use client";

import { useState } from "react";

type Props = {
  orderId: string;
  currentStatus: string;
};

export default function OrderStatusForm({
  orderId,
  currentStatus,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || "Failed to update order");
        setLoading(false);
        return;
      }

      setMessage("Order status updated successfully.");
      setLoading(false);

      // Refresh server data
      window.location.reload();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="font-display text-xl mb-4">
        Update Order Status
      </h2>

      <div className="flex gap-3 items-center">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-3 rounded-xl border border-[#6B1F3D]/15"
        >
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-[#6B1F3D] text-white disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Status"}
        </button>
      </div>

      {message && (
        <p className="mt-4 text-sm text-[#6B1F3D]">
          {message}
        </p>
      )}
    </div>
  );
}