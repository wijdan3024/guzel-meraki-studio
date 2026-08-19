import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

// @route  GET /api/categories
// @desc   List all categories (public)
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
}

// @route  POST /api/categories
// @desc   Create a new category (admin only)
export async function POST(request: NextRequest) {
  const user = getAuthUser(request);

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Access denied. Admin only.", data: {} },
      { status: 403 }
    );
  }

  const { name, description, imageUrl } = await request.json();

  if (!name) {
    return NextResponse.json(
      { success: false, message: "Category name is required", data: {} },
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug: slugify(name),
      description,
      imageUrl,
    },
  });

  return NextResponse.json(
    { success: true, message: "Category created successfully", data: category },
    { status: 201 }
  );
}