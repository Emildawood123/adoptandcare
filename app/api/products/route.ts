import { dbConnect } from "@/app/lib/mongodb";
import Product from "@/models/Product";import { NextRequest, NextResponse } from "next/server";
;



export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Connect to MongoDB
    await dbConnect();

    // Parse the request body
    const body = await req.json();
    const { name, description, price, image } = body;

    // Validate the input
    if (!name || !description || !price || !image) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Find the product by ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, image },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Return the updated product
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();
      const name = formData.get("name") as string;
        const description = formData.get("description") as string;
      const file = formData.get("file");
      const price = formData.get("price")
     if (!name || !file || !(file instanceof Blob)) {
      console.log("Error: Missing name or file, or file is not a Blob", { name, file });
      return NextResponse.json({ message: "Name and image are required, and file must be a valid image" }, { status: 400 });
    }

    // Convert file (Blob) to Base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const newProduct = new Product({ name, image: base64Image, description, price});
    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Error creating product" }, { status: 500 });
  }
}
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { productId } = query;

  if (method === "DELETE") {
    try {
      await dbConnect();

      // Find the product by its ID and remove it
      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return res.status(404).json({ message: "product not found" });
      }

      return res.status(200).json({ message: "product deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete product", error: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
