import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import Pet from "@/models/Pet";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";


// Handler to get all pets
export async function GET(req: NextRequest, { params }: { params: { id?: string } }) {
    await dbConnect(); // Ensure a connection to MongoDB
    if (!params.id) { 
    return NextResponse.json({ message: "Invalid pet ID or server error" }, { status: 400 });
    }
    // Fetch a pet by ID if `id` is provided
  try {
    const pet = await Pet.find({ user: params.id })
    const user = await User.find({_id: pet.user})
        console.log(pet)
      if (!pet) {
        return NextResponse.json({ message: "Pet not found" }, { status: 404 });
      }
      return NextResponse.json(pet, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Invalid pet ID or server error" }, { status: 400 });
    }
  
}


// Handle PUT requests to update a pet

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // Connect to the database
  await dbConnect();

  const { id } = params;

  // Check if ID exists
  if (!id) {
    return NextResponse.json({ message: "Pet ID is required!" }, { status: 400 });
  }

  try {
    // Parse the request body
    const body = await req.json();

    // Ensure required fields are present
    if (!body.name || !body.image) {
      return NextResponse.json({ message: "Pet name and image are required!" }, { status: 400 });
    }

    // Find and update the pet in the database
    const updatedPet = await Pet.findByIdAndUpdate(
      id, // Use the ID from the URL params
      {
        $set: {
          name: body.name,
          description: body.description || "",
          age: body.age || 0,
          breed: body.breed || "",
          image: body.image, // Assuming image is URL or base64 string
        },
      },
      { new: true } // Return the updated pet document
    );

    // Handle if pet was not found
    if (!updatedPet) {
      return NextResponse.json({ message: "Pet not found" }, { status: 404 });
    }

    // Return the updated pet data
    return NextResponse.json(updatedPet, { status: 200 });
  } catch (error) {
    console.error("Error updating pet:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
