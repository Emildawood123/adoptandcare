import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserById } from "@/lib/db";

// Create a new vet consultation request
export async function POST(req: NextRequest) {
  // Log the request body for debugging
  try {
    const { userId, requestedDate, vetId } = await req.json();
    console.log(userId, requestedDate, vetId);
    // Validate the input
    if (!userId || !requestedDate || !vetId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Create the vet consultation request (no petOwnerId, no message)
    const vetConsultation = await prisma.vetConsultation.create({
      data: {
        userId: userId,
        requestedDate: new Date(requestedDate),
        status: "Pending",
        vetId: Number(vetId),
      },
    });

    return NextResponse.json(vetConsultation, { status: 201 });
  } catch (error) {
    console.error("Error creating vet consultation request:", error);
    return NextResponse.json({ message: "Failed to create vet consultation request" }, { status: 500 });
  }
}

// Get vet consultations, filtered by userId or vetId if provided
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");



    // If neither userId nor vetId is provided, return all consultations
    var vetConsultations = await prisma.vetConsultation.findMany({ 
      where: { vetId: Number(userId) },
    });

    // Fetch user data for each consultation and merge
    const consultationsWithUser = await Promise.all(
      vetConsultations.map(async (consultation) => {
        const user = await getUserById(consultation.userId);
        return { ...consultation, user };
      })
    );

    return NextResponse.json(consultationsWithUser, { status: 200 });
  } catch (error) {
    console.error("Error fetching vet consultation requests:", error);
    return NextResponse.json({ message: "Failed to fetch vet consultation requests" }, { status: 500 });
  }
}

// Update vet consultation status by ID
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
