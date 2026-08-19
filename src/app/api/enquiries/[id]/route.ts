import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// @route  PUT /api/enquiries/:id (admin only)
export async function PUT(request: NextRequest, { params }: Params) {
  const user = getAuthUser(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Access denied. Admin only.", data: {} },
      { status: 403 }
    );
  }

  const { id } = await params;
  const { status } = await request.json();

  const validStatuses = ["NEW", "CONTACTED", "CONFIRMED", "CLOSED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { success: false, message: `Status must be one of: ${validStatuses.join(", ")}`, data: {} },
      { status: 400 }
    );
  }

  const enquiry = await prisma.eventEnquiry.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({
    success: true,
    message: `Enquiry marked as ${status}`,
    data: enquiry,
  });
}
