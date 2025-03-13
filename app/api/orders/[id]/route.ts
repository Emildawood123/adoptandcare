import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  console.log("Order ID to delete:", id);

  if (!id) {
    return NextResponse.json({ message: "Order ID is missing" }, { status: 400 });
  }

  try {
    // Delete related OrderItem records first
    await prisma.orderItem.deleteMany({
      where: { orderId: Number(id) },
    });

    // Delete the order
    const order = await prisma.order.delete({
      where: { id: Number(id) },
    });

    console.log("Order deleted:", order);

    return NextResponse.json({ message: "Order canceled successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error canceling order:", error.message);
    return NextResponse.json({ message: "Failed to cancel order", error: error.message }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  try {
    // Fetch all orders with related user and product information
    const orders = await prisma.order.findMany({
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
export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const { status } = await req.json();

  console.log("Order ID to update:", id);
  console.log("New status:", status);

  if (!id || !status) {
    return NextResponse.json({ message: "Order ID or status is missing" }, { status: 400 });
  }

  try {
    // Update the order status
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    console.log("Order updated:", order);

    return NextResponse.json({ message: "Order status updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    return NextResponse.json({ message: "Failed to update order status", error: error.message }, { status: 500 });
  }
}
