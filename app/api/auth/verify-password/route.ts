import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, updateUserPasswordByEmail } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, newPassword } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    // Fetch user from your database
    const user = await getUserByEmail(email);

    if (!user || !user.passwordHash) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Compare password using passwordHash column
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid current password." }, { status: 401 });
    }

    // If newPassword is provided, update the password
    if (newPassword) {
      const newHash = await bcrypt.hash(newPassword, 10);
      await updateUserPasswordByEmail(email, newHash);
      return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
    }

    // Password is correct but no new password provided
    return NextResponse.json({ message: "Password verified." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
