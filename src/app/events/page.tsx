"use client";

import { useState } from "react";
import { Heart, Cake, Briefcase, Sparkles } from "lucide-react";

const eventTypes = [
  { value: "WEDDING", label: "Wedding", icon: Heart },
  { value: "BIRTHDAY", label: "Birthday", icon: Cake },
  { value: "CORPORATE", label: "Corporate", icon: Briefcase },
  { value: "CUSTOM", label: "Custom Event", icon: Sparkles },
];

export default function EventsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "WEDDING",
    eventDate: "",
    guestCount: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setStatusMessage(data.message);
        setForm({
          name: "",
          email: "",
          phone: "",
          eventType: "WEDDING",
          eventDate: "",
          guestCount: "",
          message: "",
        });
      } else {
        setStatus("error");
        setStatusMessage(data.message);
      }
    } catch {
      setStatus("error");
      setStatusMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.25em] text-[#C9A25D] uppercase mb-3">
            Event Decor Services
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-[#2B2320] mb-5">
            Celebrations, thoughtfully designed
          </h1>
          <p className="text-[#2B2320]/60 max-w-xl mx-auto">
            From intimate gatherings to grand weddings, we bring a considered
            aesthetic to every occasion. Tell us about your event, and let&apos;s
            design something memorable together.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {eventTypes.map(({ value, label, icon: Icon }) => (
            <div key={value} className="bg-white rounded-2xl p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#6B1F3D]/8 flex items-center justify-center mb-4">
                <Icon size={22} className="text-[#6B1F3D]" strokeWidth={1.5} />
              </div>
              <p className="font-display text-lg text-[#2B2320]">{label}</p>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="font-display text-2xl text-[#2B2320] mb-8 text-center">
            Send an enquiry
          </h2>

          {status === "success" ? (
            <div className="text-center py-8">
              <p className="text-[#6B1F3D] font-display text-xl mb-2">Thank you!</p>
              <p className="text-[#2B2320]/60">{statusMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === "error" && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                  {statusMessage}
                </p>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D]"
                />
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="tel"
                  required
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D]"
                />
                <select
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D] bg-white"
                >
                  {eventTypes.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="date"
                  placeholder="Event date"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D]"
                />
                <input
                  type="number"
                  min={1}
                  placeholder="Estimated guest count"
                  value={form.guestCount}
                  onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D]"
                />
              </div>

              <textarea
                required
                rows={4}
                placeholder="Tell us about your vision for the event..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D] resize-none"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 rounded-full bg-[#6B1F3D] text-white hover:bg-[#571831] transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Sending..." : "Send Enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}