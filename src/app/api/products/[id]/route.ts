import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

type Params = { params: Promise<{ id: string }> };

// @route  GET /api/products/:id
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: true },
  });

  if (!product) {
    return NextResponse.json(
      { success: false, message: "Product not found", data: {} },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
}

// @route  PUT /api/products/:id (admin only)
export async function PUT(request: NextRequest, { params }: Params) {
  const user = getAuthUser(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Access denied. Admin only.", data: {} },
      { status: 403 }
    );
  }

  const { id } = await params;
  const { name, description, price, images, stock, status, categoryId } =
    await request.json();

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug: name ? slugify(name) : undefined,
      description,
      price,
      images,
      stock,
      status,
      categoryId,
    },
    include: { category: true, variants: true },
  });

  return NextResponse.json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
}

// @route  DELETE /api/products/:id (admin only)
export async function DELETE(request: NextRequest, { params }: Params) {
  const user = getAuthUser(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Access denied. Admin only.", data: {} },
      { status: 403 }
    );
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({
    success: true,
    message: "Product deleted successfully",
    data: {},
  });
}