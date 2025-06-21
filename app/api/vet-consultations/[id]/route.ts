import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }) {
  try {
    const { id } = params; // Get the consultation ID from the URL
    const { status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ message: "Missing consultation ID or status" }, { status: 400 });
    }

    const updated = await prisma.vetConsultation.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating vet consultation status:", error);
    return NextResponse.json({ message: "Failed to update vet consultation status" }, { status: 500 });
  }
}
