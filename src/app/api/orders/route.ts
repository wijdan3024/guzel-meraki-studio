import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

type CartItem = {
  productId: string;
  variantId?: string | null;
  quantity: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      notes,
    } = body;

    // -----------------------------
    // Basic validation
    // -----------------------------
    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required delivery details.",
          data: {},
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
          data: {},
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate cart item quantities
    // -----------------------------
    for (const item of items as CartItem[]) {
      if (
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid cart item.",
            data: {},
          },
          { status: 400 }
        );
      }
    }

    // -----------------------------
    // Get logged-in user if available
    // -----------------------------
    const authUser = getAuthUser(request);

    // -----------------------------
    // Get products from database
    // -----------------------------
    const productIds = [
      ...new Set(
        (items as CartItem[]).map((item) => item.productId)
      ),
    ];

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        variants: true,
      },
    });

    // -----------------------------
    // Make sure all products exist
    // -----------------------------
    if (products.length !== productIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more products in your cart no longer exist.",
          data: {},
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Build order items
    // -----------------------------
    const orderItems: {
      productId: string;
      variantId: string | null;
      quantity: number;
      price: number;
    }[] = [];

    let totalAmount = 0;

    for (const item of items as CartItem[]) {
      const product = products.find(
        (p) => p.id === item.productId
      );

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: "Product not found.",
            data: {},
          },
          { status: 400 }
        );
      }

      // Product must be active
      if (product.status !== "ACTIVE") {
        return NextResponse.json(
          {
            success: false,
            message: `${product.name} is currently unavailable.`,
            data: {},
          },
          { status: 400 }
        );
      }

      // -----------------------------
      // Determine price
      // -----------------------------
      let itemPrice = Number(product.price);
      let variantId: string | null = null;

      if (item.variantId) {
        const variant = product.variants.find(
          (v) => v.id === item.variantId
        );

        if (!variant) {
          return NextResponse.json(
            {
              success: false,
              message: `Selected variant for ${product.name} was not found.`,
              data: {},
            },
            { status: 400 }
          );
        }

        variantId = variant.id;
        itemPrice += Number(variant.priceModifier);

        if (variant.stock < item.quantity) {
          return NextResponse.json(
            {
              success: false,
              message: `Not enough stock for ${product.name} (${variant.name}: ${variant.value}).`,
              data: {},
            },
            { status: 400 }
          );
        }
      } else {
        // -----------------------------
        // Check normal product stock
        // -----------------------------
        if (product.stock < item.quantity) {
          return NextResponse.json(
            {
              success: false,
              message: `Not enough stock for ${product.name}.`,
              data: {},
            },
            { status: 400 }
          );
        }
      }

      const lineTotal = itemPrice * item.quantity;

      totalAmount += lineTotal;

      orderItems.push({
        productId: product.id,
        variantId,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    // -----------------------------
    // Generate order number
    // -----------------------------
    const year = new Date().getFullYear();

    const randomPart = Math.floor(
      100000 + Math.random() * 900000
    );

    const orderNumber = `GMS-${year}-${randomPart}`;

    // -----------------------------
    // Create order
    // -----------------------------
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "PENDING",
        totalAmount,
        customerName,
        customerEmail: customerEmail.toLowerCase(),
        customerPhone,
        deliveryAddress,
        notes: notes || null,

        userId: authUser?.id || null,

        items: {
          create: orderItems,
        },
      },

      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully.",
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Could not create order. Please try again.",
        data: {},
      },
      { status: 500 }
    );
  }
}