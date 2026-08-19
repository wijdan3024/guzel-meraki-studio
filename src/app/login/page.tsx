"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Hard redirect (router.push skip)
      if (data.data?.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/account";
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6F2] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-2xl text-[#6B1F3D]">
            Guzel Meraki
          </Link>
          <p className="text-[#2B2320]/50 mt-2 text-sm">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#6B1F3D]/08">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div>
              <label className="block text-xs text-[#2B2320]/50 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#6B1F3D]/12 focus:outline-none focus:border-[#6B1F3D]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs text-[#2B2320]/50 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#6B1F3D]/12 focus:outline-none focus:border-[#6B1F3D]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center text-sm text-[#2B2320]/50 mt-6">
            Don’t have an account?{" "}
            <Link href="/register" className="text-[#6B1F3D] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}