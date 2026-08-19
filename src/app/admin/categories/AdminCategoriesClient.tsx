"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface Category {
  id: string;
  name: string;
  description: string | null;
  _count: { products: number };
}

export default function AdminCategoriesClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowForm(false);
      setForm({ name: "", description: "", imageUrl: "" });
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products inside it may be affected.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm tracking-widest text-[#C9A25D] font-semibold mb-2 uppercase">Manage</p>
          <h1 className="font-display text-3xl text-[#2B2320]">Categories</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B1F3D] text-white text-sm hover:bg-[#571831] transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <p className="font-display text-lg">{cat.name}</p>
              <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={15} />
              </button>
            </div>
            <p className="text-sm text-[#2B2320]/55 mb-3 line-clamp-2">{cat.description}</p>
            <p className="text-xs text-[#C9A25D]">{cat._count.products} products</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">Add Category</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input required placeholder="Category name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15" />
              <textarea placeholder="Description" rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#6B1F3D]/15 resize-none" />
              <ImageUpload
                value={form.imageUrl ? [form.imageUrl] : []}
                onChange={(urls) => setForm({ ...form, imageUrl: urls[0] ?? "" })}
                multiple={false}
              />
              <button type="submit" disabled={saving}
                className="w-full py-3.5 rounded-xl bg-[#6B1F3D] text-white disabled:opacity-60">
                {saving ? "Saving..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
