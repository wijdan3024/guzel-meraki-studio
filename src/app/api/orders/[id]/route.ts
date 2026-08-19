import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { sendPaymentConfirmationEmail } from "@/lib/email";

type Params = {
  params: Promise<{ id: string }>;
};

// PUT /api/orders/:id
// Admin only
// Used to update order status
export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    // -----------------------------
    // Check logged-in admin
    // -----------------------------
    const user = getAuthUser(request);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin only.",
          data: {},
        },
        { status: 403 }
      );
    }

    // -----------------------------
    // Get order ID
    // -----------------------------
    const { id } = await params;

    // -----------------------------
    // Get requested status
    // -----------------------------
    const { status } = await request.json();

    const validStatuses = [
      "PENDING",
      "PAID",
      "FAILED",
      "CANCELLED",
      "SHIPPED",
      "DELIVERED",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Status must be one of: ${validStatuses.join(", ")}`,
          data: {},
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Find current order
    // -----------------------------
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
          data: {},
        },
        { status: 404 }
      );
    }

    // -----------------------------
    // Update order
    // -----------------------------
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // -----------------------------
    // If order is marked PAID
    // send confirmation email
    // -----------------------------
    if (
      status === "PAID" &&
      existingOrder.status !== "PAID"
    ) {
      try {
        await sendPaymentConfirmationEmail({
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          orderNumber: order.orderNumber,
          totalAmount: Number(order.totalAmount),
        });

        console.log(
          `Payment confirmation email sent to ${order.customerEmail}`
        );
      } catch (emailError) {
        console.error(
          "Payment confirmation email failed:",
          emailError
        );

        // IMPORTANT:
        // Order remains PAID even if email fails.
        // We don't undo the payment/order status.
      }
    }

    return NextResponse.json({
      success: true,
      message: `Order marked as ${status}`,
      data: order,
    });
  } catch (error) {
    console.error("Update order error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while updating the order.",
        data: {},
      },
      { status: 500 }
    );
  }
}