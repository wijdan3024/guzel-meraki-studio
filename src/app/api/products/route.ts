import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

// @route  GET /api/products?category=&search=&status=
// @desc   List products with optional filters (public)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const search = searchParams.get("search");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};

  // Public visitors only see ACTIVE products unless a specific status is
  // explicitly requested (used by the admin dashboard to see everything).
  where.status = status ?? "ACTIVE";

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    success: true,
    message: "Products fetched successfully",
    data: products,
  });
}

// @route  POST /api/products (admin only)
export async function POST(request: NextRequest) {
  const user = getAuthUser(request);

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Access denied. Admin only.", data: {} },
      { status: 403 }
    );
  }

  const { name, description, price, images, stock, categoryId, variants } =
    await request.json();

  if (!name || !description || price === undefined || !categoryId) {
    return NextResponse.json(
      {
        success: false,
        message: "Please provide name, description, price, and categoryId",
        data: {},
      },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug: slugify(name),
      description,
      price,
      images: images ?? [],
      stock: stock ?? 0,
      categoryId,
      variants: variants?.length
        ? {
            create: variants.map(
              (v: { name: string; value: string; priceModifier?: number; stock?: number }) => ({
                name: v.name,
                value: v.value,
                priceModifier: v.priceModifier ?? 0,
                stock: v.stock ?? 0,
              })
            ),
          }
        : undefined,
    },
    include: { category: true, variants: true },
  });

  return NextResponse.json(
    { success: true, message: "Product created successfully", data: product },
    { status: 201 }
  );
}