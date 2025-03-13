import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Log the values to debug the issue
    console.log("userId:", userId);

    if (!userId) {
      throw new Error("Missing required fields");
    }

    // Fetch cart items for the user
    const cart = await prisma.cart.findUnique({
      where: { userId: Number(userId) },
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

export const config = {
  api: {
    bodyParser: true,
  },
};
