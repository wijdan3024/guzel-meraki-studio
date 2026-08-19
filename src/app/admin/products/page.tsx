import { prisma } from "@/lib/prisma";
import AdminProductsClient from "./AdminProductsClient";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const serialized = products.map((p) => ({ ...p, price: Number(p.price) }));

  return <AdminProductsClient products={serialized} categories={categories} />;
}
