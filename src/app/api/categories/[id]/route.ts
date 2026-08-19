import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

type Params = { params: Promise<{ id: string }> };

// @route  GET /api/categories/:id
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    return NextResponse.json(
      { success: false, message: "Category not found", data: {} },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Category fetched successfully",
    data: category,
  });
}

// @route  PUT /api/categories/:id (admin only)
export async function PUT(request: NextRequest, { params }: Params) {
  const user = getAuthUser(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Access denied. Admin only.", data: {} },
      { status: 403 }
    );
  }

  const { id } = await params;
  const { name, description, imageUrl } = await request.json();

  const category = await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: name ? slugify(name) : undefined,
      description,
      imageUrl,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
}

// @route  DELETE /api/categories/:id (admin only)
export async function DELETE(request: NextRequest, { params }: Params) {
  const user = getAuthUser(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Access denied. Admin only.", data: {} },
      { status: 403 }
    );
  }

  const { id } = await params;
  await prisma.category.delete({ where: { id } });

  return NextResponse.json({
    success: true,
    message: "Category deleted successfully",
    data: {},
  });
}