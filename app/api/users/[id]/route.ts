import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const { name, email, avatar } = await req.json();

  console.log("User ID to update:", id);
  console.log("New data:", { name, email, avatar });

  if (!id || !name || !email) {
    return NextResponse.json({ message: "User ID, name, or email is missing" }, { status: 400 });
  }

  try {
    // Update the user information
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, avatar },
    });

    console.log("User updated:", user);

    return NextResponse.json({ message: "User profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    return NextResponse.json({ message: "Failed to update user profile", error: error.message }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  console.log("User ID to fetch:", id);

  if (!id) {
    return NextResponse.json({ message: "User ID is missing" }, { status: 400 });
  }

  try {
    // Fetch the user information
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { avatar: true }, // Only select the avatar field
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("User fetched:", user);

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return NextResponse.json({ message: "Failed to fetch user profile", error: error.message }, { status: 500 });
  }
}
