import { dbConnect } from "@/app/lib/mongodb";
import Pet from "@/models/Pet";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id?: string, userId: string } }) {
  await dbConnect();
  if (!params.id) {
    return NextResponse.json({ message: "Invalid pet ID or server error" }, { status: 400 });
  }
  try {
    await User.updateOne( { _id: params.userId }, { $pull: { pets: params.id } } )
      const pet = await Pet.deleteOne({_id: params.id})
        console.log(pet)
      if (!pet) {
        return NextResponse.json({ message: "Pet not found" }, { status: 404 });
      }
      return NextResponse.json(pet, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Invalid pet ID or server error" }, { status: 400 });
    }
}
