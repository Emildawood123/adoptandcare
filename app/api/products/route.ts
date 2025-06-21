import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Create a new product
export async function POST(request: Request) {
  try {
    console.log("Request received at /api/products");

    // Log the raw request body
    const rawBody = await request.text();
    console.log("Raw request body:", rawBody);

    // Parse the request body
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { success: false, message: "Invalid JSON format" },
        { status: 400 }
      );
    }
    console.log("Parsed request body:", body);

    const { name, price, description, image, quantity } = body;

    // Validate input data
    if (!name || !price || !image || quantity === undefined) {
      console.error("Validation failed: Name, price, image, and quantity are required");
      return NextResponse.json(
        { success: false, message: "Name, price, image, and quantity are required" },
        { status: 400 }
      );
    }

    // Log before database operation
    console.log("Creating product in the database...");

    // Create the product in the database
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price), // Convert price to a float
        description,
        image,
        quantity: parseInt(quantity), // Convert quantity to an integer
      },
    });

    // Log success
    console.log("Product created successfully:", product);

    // Return success response
    return NextResponse.json(
      { success: true, message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    // Ensure error is an object
    const errorObject = error instanceof Error ? error : new Error("Unknown error occurred");
    console.error("Error in /api/products route:", errorObject);

    // Return error response
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}

// GET: Fetch all products
export async function GET() {
  try {
    console.log("Fetching products from the database...");

    // Fetch all products from the database
    const products = await prisma.product.findMany();

    // Log success
    console.log("Products fetched successfully:", products);

    // Return the products as a JSON response
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    // Ensure error is an object
    const errorObject = error instanceof Error ? error : new Error(String(error));
    console.error("Error fetching products:", errorObject);

    // Return error response
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product by id (expects ?id=PRODUCT_ID in query)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    console.log(typeof id, "ID received:", id);
    const productId = id;
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Invalid product id" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: Number(productId) },
    });

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    // Log the error for debugging
    console.error("Error deleting product:", error);

    // Prisma foreign key error
    if (
      error.code === "P2003" ||
      (error.message && error.message.includes("Foreign key constraint failed"))
    ) {
      return NextResponse.json(
        { success: false, message: "Cannot delete product: It is referenced in other records (e.g., orders or cart)." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
