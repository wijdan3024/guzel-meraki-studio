"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  category: { name: string };
}

interface Category {
  id: string;
  name: string;
}

const emptyForm = { name: "", description: "", price: "", stock: "", categoryId: "", images: [] as string[] };

export default function AdminProductsClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });
      setShowForm(false);
      setForm(emptyForm);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm tracking-widest text-[#C9A25D] font-semibold mb-2 uppercase">Manage</p>
          <h1 className="font-display text-3xl text-[#2B2320]">Products</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B1F3D] text-white text-sm hover:bg-[#571831] transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#6B1F3D]/8 text-left">
              <th className="px-6 py-4 font-medium text-[#2B2320]/55">Name</th>
              <th className="px-6 py-4 font-medium text-[#2B2320]/55">Category</th>
              <th className="px-6 py-4 font-medium text-[#2B2320]/55">Price</th>
              <th className="px-6 py-4 font-medium text-[#2B2320]/55">Stock</th>
              <th className="px-6 py-4 font-medium text-[#2B2320]/55">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[#6B1F3D]/5 last:border-0">
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4 text-[#2B2320]/60">{p.category.name}</td>
                <td className="px-6 py-4">Rs. {p.price.toLocaleString()}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${p.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">Add Product</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input required placeholder="Product name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15" />
              <textarea required placeholder="Description" rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 resize-none" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Price" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15" />
                <input required type="number" placeholder="Stock" value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15" />
              </div>
              <ImageUpload
                value={form.images}
                onChange={(images) => setForm({ ...form, images })}
              />
              <select required value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 bg-white">
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button type="submit" disabled={saving}
                className="w-full py-3.5 rounded-xl bg-[#6B1F3D] text-white disabled:opacity-60">
                {saving ? "Saving..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
