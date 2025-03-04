import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import Pet from "@/models/Pet"; // Ensure this is the correct path to your Pet model
import AdoptionRequest from "@/models/AdoptionRequest";// Ensure this is the correct path to your AdoptionRequest model

export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const { petId, userId, message } = await req.json();

    // Validate inputs
    if (!petId || !userId || !message) {
      return NextResponse.json(
        { message: "Pet ID, User ID, and Message are required" },
        { status: 400 }
      );
    }

    // Check if the pet exists
    const pet = await Pet.findById(petId);
    if (!pet) {
      return NextResponse.json({ message: "Pet not found" }, { status: 404 });
    }

    // Check if the pet is available for adoption


    // Create the adoption request
    const newAdoptionRequest = new AdoptionRequest({
      pet: petId,
      user: userId,
      message,
      status: "Pending",
    });

    // Save the adoption request to the database
    await newAdoptionRequest.save();

    // Return the created adoption request
    return NextResponse.json(newAdoptionRequest, { status: 201 });
  } catch (error) {
    // Handle errors
    console.error("Error creating adoption request:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the adoption request" },
      { status: 500 }
    );
  }
}

// Fetch all adoption requests (for admin)
export async function GET() {
  try {
    await dbConnect();
    const requests = await AdoptionRequest.find().populate("pet user"); // Populate pet and user details
    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch adoption requests" }, { status: 500 });
  }
}

// Update an adoption request (for admin)
export async function PUT(req: Request) {
  try {
    await dbConnect();

    const { requestId, status } = await req.json();

    // Validate status
    if (!["Approved", "Rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status. Must be 'Approved' or 'Rejected'" },
        { status: 400 }
      );
    }

    // Find and update the adoption request
    const updatedRequest = await AdoptionRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true } // Return the updated document
    )
      .populate("pet")
      .populate("user");

    if (!updatedRequest) {
      return NextResponse.json(
        { message: "Adoption request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update adoption request" },
      { status: 500 }
    );
  }
}

// Delete an adoption request (for admin)
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { requestId } = await req.json();

    // Find and delete the request
    const request = await adoptionRequest.findByIdAndDelete(requestId);
    if (!request) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Request deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete adoption request" }, { status: 500 });
  }
}
