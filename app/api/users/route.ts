import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const isVet = req.nextUrl.searchParams.get("isVet");
  let users;
  if (isVet === "true") {
    users = await prisma.user.findMany({ where: { isVet: true } });
  } else {
    users = await prisma.user.findMany();
  }
  return NextResponse.json(users);
}
