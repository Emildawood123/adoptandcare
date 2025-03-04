import { dbConnect } from "@/app/lib/mongodb";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id?: string} }) {
  await dbConnect();
  if (!params.id) {
    return NextResponse.json({ message: "Invalid product ID or server error" }, { status: 400 });
  }
  try {
      const product = await Product.deleteOne({_id: params.id})
        console.log(product)
      if (!product) {
        return NextResponse.json({ message: "product not found" }, { status: 404 });
      }
      return NextResponse.json(product, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Invalid product ID or server error" }, { status: 400 });
    }
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // Connect to the database
  await dbConnect();

  const { id } = params;

  // Check if ID exists
  if (!id) {
    return NextResponse.json({ message: "Product ID is required!" }, { status: 400 });
  }

  try {
    // Parse the request body
    const body = await req.json();

    // Ensure required fields are present
    if (!body.name || !body.image) {
      return NextResponse.json({ message: "Product name and image are required!" }, { status: 400 });
    }

    // Find and update the Product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      id, // Use the ID from the URL params
      {
        $set: {
          name: body.name,
          description: body.description || "",
          price: body.price || 0,
          image: body.image, // Assuming image is URL or base64 string
        },
      },
      { new: true } // Return the updated Product document
    );

    // Handle if Product was not found
    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Return the updated Product data
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating Product:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
