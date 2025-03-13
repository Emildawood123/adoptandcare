import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const pet = await prisma.pet.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(pet, { status: 200 });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return NextResponse.json({ message: "Invalid pet ID or server error" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { name, age, breed, description } = await req.json();

    const pet = await prisma.pet.update({
      where: { id: Number(id) },
      data: { name, age, breed, description,  },
    });

    if (!pet) {
      return NextResponse.json({ message: "Pet not found" }, { status: 404 });
    }

    return NextResponse.json(pet, { status: 200 });
  } catch (error) {
    console.error("Error updating pet:", error);
    return NextResponse.json({ message: "Invalid pet ID or server error" }, { status: 400 });
  }
}
