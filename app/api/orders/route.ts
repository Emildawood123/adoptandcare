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

    // Fetch orders for the user
    const orders = await prisma.order.findMany({
      where: { userId: Number(userId) },
      include: {
        user: true, // Include user information
        orderItems: {
          include: {
            product: true, // Include product information
          },
        },
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, cartItems } = await req.json();

    // Log the values to debug the issue
    console.log("userId:", userId);
    console.log("cartItems:", cartItems);

    if (!userId || !cartItems || cartItems.length === 0) {
      throw new Error("Missing required fields");
    }
    console.log("first")
    // Calculate the total amount
    const totalAmount = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    // Create the order
    console.log("second")
    const order = await prisma.order.create({
      data: {
        userId: Number(userId),
        totalAmount,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });
    
    const cart = await prisma.cart.findUnique({
      where: { userId: Number(userId) },
      include: { cartItems: true }, // Include cart items to ensure it is fetched correctly
    });

    console.log("Fetched cart:", cart);

    if (cart) {
      // Delete the cart items first
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      console.log("Cart items deleted");

      // Delete the cart after creating the order
      await prisma.cart.delete({
        where: { userId: Number(userId) },
      });
      console.log("Cart deleted");
    } else {
      console.log("Cart not found");
    }

    console.log("third");
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Fetch the order and its items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }, // assuming order.items contains { productId, quantity }
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // If status is not "pending", decrease product quantities
    if (status !== "pending") {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: e.message || "Server error" }, { status: 500 });
  }
}
