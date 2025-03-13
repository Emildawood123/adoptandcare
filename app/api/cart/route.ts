import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, productId, quantity } = await req.json();

    // Log the values to debug the issue
    console.log("userId:", userId);
    console.log("productId:", productId);
    console.log("quantity:", quantity);

    if (!userId || !productId || !quantity) {
      throw new Error("Missing required fields");
    }

    // Find or create the cart for the user
    let cart = await prisma.cart.findUnique({
      where: { userId: Number(userId) },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: Number(userId),
        },
      });
    }

    // Add or update the cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: Number(productId),
        },
      },
      update: {
        quantity: {
          increment: Number(quantity),
        },
      },
      create: {
        cartId: cart.id,
        productId: Number(productId),
        quantity: Number(quantity),
      },
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ message: "Failed to add item to cart" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Log the values to debug the issue
    console.log("id:", id);

    if (!id) {
      throw new Error("Missing required fields");
    }

    // Fetch cart items for the user
    const cart = await prisma.cart.findUnique({
      where: { userId: Number(id) },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(cart.cartItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json({ message: "Failed to fetch cart items" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const { userId, cartItemId } = await req.json();

    // Log the values to debug the issue
    console.log("userId:", userId);
    console.log("cartItemId:", cartItemId);

    if (!userId || !cartItemId) {
      throw new Error("Missing required fields");
    }

    // Remove the cart item
    await prisma.cartItem.delete({
      where: { id: Number(cartItemId) },
    });

    return NextResponse.json({ message: "Item removed from cart" }, { status: 200 });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json({ message: "Failed to remove item from cart" }, { status: 500 });
  }
}
