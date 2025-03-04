import { dbConnect } from "@/app/lib/mongodb";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id?: string } }) {
  await dbConnect();

  // Check if userId is provided
  if (!params.id) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    // Fetch orders for the given user ID
    const orders = await Order.find({ user: params.id }).populate("products.product");
    console.log(orders); // Log orders for debugging

    if (!orders || orders.length === 0) {
      return NextResponse.json({ message: "No orders found for this user" }, { status: 404 });
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  const { id } = params;

  try {
    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Check if the order can be canceled (e.g., status is "Pending")
    if (order.status !== "Pending") {
      return NextResponse.json({ message: "Order cannot be canceled" }, { status: 400 });
    }

    // Delete the order
    await Order.findByIdAndDelete(id);
    return NextResponse.json({ message: "Order canceled successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error canceling order:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  const { id } = params;
  const { status } = await request.json();

  try {
    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Update the order status
    order.status = status;
    await order.save();

    return NextResponse.json({ message: "Order status updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
