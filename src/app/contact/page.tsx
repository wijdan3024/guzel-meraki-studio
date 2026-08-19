"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: "N/A",
          eventType: "CUSTOM",
          message: form.message,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "success" : "error");
      if (data.success) setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6F2] pt-32 pb-20 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.25em] text-[#C9A25D] uppercase mb-3">
            Get in Touch
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-[#2B2320]">Contact Us</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-3xl p-8 md:p-10">
            <h2 className="font-display text-xl mb-6">Send a message</h2>

            {status === "success" ? (
              <p className="text-[#6B1F3D]">Thank you — we'll be in touch soon.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D]"
                />
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D]"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="Your message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 focus:outline-none focus:border-[#6B1F3D] resize-none"
                />
                {status === "error" && (
                  <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#6B1F3D] text-white hover:bg-[#571831] transition-colors disabled:opacity-60"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                  {status !== "loading" && <Send size={16} />}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#6B1F3D]/8 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-[#6B1F3D]" />
              </div>
              <div>
                <p className="font-medium text-sm mb-1">Visit us</p>
                <p className="text-sm text-[#2B2320]/55">Near Kohinoor City, Faisalabad, Punjab</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#6B1F3D]/8 flex items-center justify-center shrink-0">
                <Phone size={18} className="text-[#6B1F3D]" />
              </div>
              <div>
                <p className="font-medium text-sm mb-1">Call us</p>
                <p className="text-sm text-[#2B2320]/55">+92 300 1234567</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#6B1F3D]/8 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-[#6B1F3D]" />
              </div>
              <div>
                <p className="font-medium text-sm mb-1">Email us</p>
                <p className="text-sm text-[#2B2320]/55">hello@guzelmeraki.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}