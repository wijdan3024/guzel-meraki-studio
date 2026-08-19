import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSafepayClient } from "@/lib/safepay";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId is required", data: {} },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found", data: {} },
        { status: 404 }
      );
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        { success: false, message: "This order has already been processed", data: {} },
        { status: 400 }
      );
    }

    const safepay = getSafepayClient();

    // Create tracker (optional - for future real Safepay integration)
    let trackerToken: string | null = null;
    try {
      const sessionResponse = await safepay.payments.session.setup({
        merchant_api_key: process.env.SAFEPAY_API_KEY as string,
        intent: "CYBERSOURCE",
        mode: "payment",
        entry_mode: "raw",
        currency: "PKR",
        amount: Math.round(Number(order.totalAmount) * 100),
        metadata: {
          order_id: order.id,
        },
      });
      trackerToken = sessionResponse?.data?.tracker?.token || null;
      console.log("Tracker created:", trackerToken);
    } catch (err) {
      console.log("Safepay tracker creation skipped:", err);
    }

    // Save payment attempt
    await prisma.paymentAttempt.create({
      data: {
        orderId: order.id,
        gateway: "safepay",
        status: "PENDING",
        transactionId: trackerToken,
        rawResponse: { note: "Awaiting customer confirmation" },
      },
    });

    // Redirect to Review page (JazzCash style confirmation)
    const reviewUrl = `/checkout/review?order=${order.orderNumber}&amount=${order.totalAmount}&name=${encodeURIComponent(
      order.customerName || ""
    )}&phone=${encodeURIComponent(order.customerPhone || "")}&email=${encodeURIComponent(
      order.customerEmail || ""
    )}&address=${encodeURIComponent(order.deliveryAddress || "")}`;

    return NextResponse.json({
      success: true,
      message: "Redirecting to payment review",
      data: {
        checkoutUrl: reviewUrl,
        trackerToken,
      },
    });
  } catch (error: any) {
    console.error("Payment initiation error:", error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: "Could not initiate payment",
        error: error?.message || "Unknown error",
        data: {},
      },
      { status: 500 }
    );
  }
}