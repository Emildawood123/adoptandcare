import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { petId, userId, message } = await req.json();
    console.log(petId, userId, message)
    if (!petId || !userId || !message) {
      throw new Error("Missing required fields");
    }
    await prisma.pet.update({
      where: { id: petId }, data: {
      availableForAdoption: false
    }},)
    const adoptionRequest = await prisma.adoptionRequest.create({
      data: {
        petId,
        userId,
        message,
      },
    });

    return NextResponse.json(adoptionRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating adoption request:", error);
    return NextResponse.json({ message: "Failed to create adoption request" }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  try {
    const adoptionRequests = await prisma.adoptionRequest.findMany({
      include: {
        pet: true,
        user: true,
      },
    });

    return NextResponse.json(adoptionRequests, { status: 200 });
  } catch (error) {
    console.error("Error fetching adoption requests:", error);
    return NextResponse.json({ message: "Failed to fetch adoption requests" }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  try {
    const {requestId,status} = await req.json()
    if (!requestId || !status) {
      throw new Error("Missing required fields");
    }
    let updatedRequest;
    if (status === "Rejected") {
      const adoptionRequest = await prisma.adoptionRequest.delete({ where: { id: requestId } })
      await prisma.pet.update({ where: { id: adoptionRequest.petId }, data: { availableForAdoption: true } })
      updatedRequest = { ...adoptionRequest, status };
    }else if (status === "Approved") {
      const adoptionRequest = await prisma.adoptionRequest.delete({ where: { id: requestId } })
      await prisma.pet.delete({ where: { id: adoptionRequest.petId } })
      updatedRequest = { ...adoptionRequest, status };
    }
    else {
      throw new Error("Invalid status");
    }
    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (e){
    return NextResponse.json({ message:e }, { status: 500 });
  }
}
