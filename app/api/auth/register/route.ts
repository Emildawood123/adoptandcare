import { dbConnect } from "../../../lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password, address, phone } = await req.json();

    console.log("Received data:", { name, email, password, address, phone });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");
    const newUser = new User({ name, email, password: hashedPassword, phoneNumber: phone, address, avater: "" });
    await newUser.save();
    console.log("User saved:", newUser);

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ message: "Error registering user", error }, { status: 500 });
  }
}
