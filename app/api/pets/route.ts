import { saveFileLocally } from "@/lib/fileUpload";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const pets = await prisma.pet.findMany();
    return NextResponse.json(pets, { status: 200 });
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch pets" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const age = parseInt(formData.get("age") as string);
    const breed = formData.get("breed") as string;
    const file = formData.get("file") as File;

    if (!name || !file || isNaN(age)) {
      return NextResponse.json(
        { success: false, message: "Invalid input data: Name, file, and age are required" },
        { status: 400 }
      );
    }

    const imageUrl = await saveFileLocally(file);

    const pet = await prisma.pet.create({
      data: {
        name,
        description,
        age,
        breed,
        image: imageUrl,
      },
    });

    return NextResponse.json({ success: true, pet }, { status: 201 });
  } catch (error) {
    console.error("Error in /api/pets route:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create pet" },
      { status: 500 }
    );
  }
}
