import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, requestedDate } = await req.json();

    // Validate the input
    if (!userId  || !requestedDate) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Create the vet consultation request
    const vetConsultation = await prisma.vetConsultation.create({
      data: {
        userId: Number(userId),
        requestedDate: new Date(requestedDate),
        status: "Pending",
      },
    });

    return NextResponse.json(vetConsultation, { status: 201 });
  } catch (error) {
    console.error("Error creating vet consultation request:", error);
    return NextResponse.json({ message: "Failed to create vet consultation request" }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  try {
    // Fetch all vet consultation requests with related user and pet information
    const vetConsultations = await prisma.vetConsultation.findMany({
      include: {
        user: true, // Include user information // Include pet information
      },
    });

    return NextResponse.json(vetConsultations, { status: 200 });
  } catch (error) {
    console.error("Error fetching vet consultation requests:", error);
    return NextResponse.json({ message: "Failed to fetch vet consultation requests" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const { status } = await req.json();

  console.log("Vet Consultation ID to update:", id);
  console.log("New status:", status);

  if (!id || !status) {
    return NextResponse.json({ message: "Vet Consultation ID or status is missing" }, { status: 400 });
  }

  try {
    // Update the vet consultation status
    const vetConsultation = await prisma.vetConsultation.update({
      where: { id: Number(id) },
      data: { status },
    });

    console.log("Vet Consultation updated:", vetConsultation);

    return NextResponse.json({ message: "Vet consultation status updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating vet consultation status:", error.message);
    return NextResponse.json({ message: "Failed to update vet consultation status", error: error.message }, { status: 500 });
  }
}
