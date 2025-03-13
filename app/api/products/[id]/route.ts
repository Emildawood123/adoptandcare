import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { saveFileLocally } from "@/lib/fileUpload";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { name, price, description, image, quantity } = await request.json();

    // Validate input data
    if (!name || !price || !image || quantity === undefined) {
      return NextResponse.json(
        { success: false, message: "Name, price, image, and quantity are required" },
        { status: 400 }
      );
    }

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        price: parseFloat(price), // Convert price to a number
        description,
        image,
        quantity: parseInt(quantity), // Convert quantity to a number
      },
    });

    // Return success response
    return NextResponse.json(
      { success: true, message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Delete the product from the database
    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
