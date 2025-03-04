import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

// Create a new order
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await request.json();
  const product = await mongoose.model("Product").findById(productId);
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const order = new Order({
    user: session.user._id,
    products: [{ product: productId, quantity }],
    totalAmount: product.price * quantity,
    status: "Pending",
  });

  await order.save();
  return NextResponse.json(
    { message: "Order created successfully", order },
    { status: 201 }
  );
}

// Fetch orders for the logged-in user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const orders = await Order.find()
  return NextResponse.json(orders, { status: 200 });
}
