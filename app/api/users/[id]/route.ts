import { NextResponse } from "next/server";
import User from "@/models/User";
import { dbConnect } from "@/app/lib/mongodb";
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await dbConnect();

    // Parse the request body
    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const avater = formData.get("avater");

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;

    // Handle avatar upload
    if (avater) user.avater = avater

    await user.save();

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }
}
