import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, variants: true },
  });

  if (!product) notFound();

  return (
    <ProductDetailClient
      product={{
        ...product,
        price: Number(product.price),
        variants: product.variants.map((v) => ({
          ...v,
          priceModifier: Number(v.priceModifier),
        })),
      }}
    />
  );
}
