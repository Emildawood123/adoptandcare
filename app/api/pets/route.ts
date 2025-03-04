import { NextResponse } from "next/server";

import Pet from "@/models/Pet";
import { dbConnect } from "@/app/lib/mongodb";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();
      const name = formData.get("name") as string;
      const user = formData.get("user") as string;
      const age = formData.get("age") as string;
      const breed = formData.get("breed") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file");

     if (!name || !file || !(file instanceof Blob)) {
      console.log("Error: Missing name or file, or file is not a Blob", { name, file });
      return NextResponse.json({ message: "Name and image are required, and file must be a valid image" }, { status: 400 });
    }

    // Convert file (Blob) to Base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const newPet = new Pet({ name, image: base64Image, description, user, age, breed });
    await newPet.save();
     await User.findByIdAndUpdate(
      user,
      { $push: { pets: newPet._id } }, // Add the new pet to the user's pets array
      { new: true }
    );
    return NextResponse.json(newPet, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Error creating pet" }, { status: 500 });
  }
}
export async function GET() {
  try {
    await dbConnect();
    const pets = await Pet.find();
    return NextResponse.json(pets);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching pets" }, { status: 500 });
  }
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { petId } = query;

  if (method === "DELETE") {
    try {
      await dbConnect();

      // Find the pet by its ID and remove it
      const pet = await Pet.findByIdAndDelete(petId);

      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      return res.status(200).json({ message: "Pet deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete pet", error: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
