"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string | null;
  guestCount: number | null;
  message: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-gray-100 text-gray-500",
};

const statusOptions = ["NEW", "CONTACTED", "CONFIRMED", "CLOSED"];

export default function AdminEnquiriesClient({ enquiries }: { enquiries: Enquiry[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === "ALL" ? enquiries : enquiries.filter((e) => e.status === filter);

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm tracking-widest text-[#C9A25D] font-semibold mb-2 uppercase">Manage</p>
        <h1 className="font-display text-3xl text-[#2B2320]">Event Enquiries</h1>
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
        <div className="bg-white rounded-3xl p-12 text-center text-[#2B2320]/50">No enquiries found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((enq) => (
            <div key={enq.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-display text-lg">{enq.name}</p>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[enq.status]}`}>
                      {enq.status}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#6B1F3D]/8 text-[#6B1F3D] capitalize">
                      {enq.eventType.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-xs text-[#2B2320]/50">
                    {enq.email} · {enq.phone}
                    {enq.eventDate && ` · ${new Date(enq.eventDate).toLocaleDateString()}`}
                    {enq.guestCount && ` · ${enq.guestCount} guests`}
                  </p>
                </div>
                <select
                  value={enq.status}
                  onChange={(e) => updateStatus(enq.id, e.target.value)}
                  disabled={updatingId === enq.id}
                  className="text-sm px-4 py-2 rounded-xl border border-[#6B1F3D]/15 bg-white"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-[#2B2320]/65 bg-[#F5F1EC] rounded-xl p-4">{enq.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
