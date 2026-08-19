"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      console.log("REGISTER RESPONSE:", data);

      if (!res.ok || !data.success) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Registration successful
      // Customer ko account page par bhej do
      window.location.href = "/account";
    } catch (error) {
      console.error("Registration error:", error);

      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6F2] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="font-display text-2xl text-[#6B1F3D]"
          >
            Guzel Meraki
          </Link>

          <p className="text-[#2B2320]/50 mt-2 text-sm">
            Create your account
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#6B1F3D]/08">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs text-[#2B2320]/50 uppercase tracking-wider mb-2">
                Full Name
              </label>

              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-3.5 rounded-xl border border-[#6B1F3D]/12 focus:outline-none focus:border-[#6B1F3D]"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-[#2B2320]/50 uppercase tracking-wider mb-2">
                Email
              </label>

              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full px-4 py-3.5 rounded-xl border border-[#6B1F3D]/12 focus:outline-none focus:border-[#6B1F3D]"
                placeholder="you@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs text-[#2B2320]/50 uppercase tracking-wider mb-2">
                Phone
              </label>

              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                className="w-full px-4 py-3.5 rounded-xl border border-[#6B1F3D]/12 focus:outline-none focus:border-[#6B1F3D]"
                placeholder="03XXXXXXXXX"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-[#2B2320]/50 uppercase tracking-wider mb-2">
                Password
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full px-4 py-3.5 rounded-xl border border-[#6B1F3D]/12 focus:outline-none focus:border-[#6B1F3D]"
                placeholder="••••••••"
              />

              <p className="text-xs text-[#2B2320]/40 mt-2">
                Password must be at least 6 characters.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? "Creating account..." : "Create Account"}

              {!loading && <ArrowRight size={16} />}
            </button>

          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-[#2B2320]/50 mt-6">
            Already have an account?{" "}

            <Link
              href="/login"
              className="text-[#6B1F3D] hover:underline"
            >
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}