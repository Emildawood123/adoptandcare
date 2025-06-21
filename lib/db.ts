import prisma from "./prisma"; // Or your actual DB client


// Example for Prisma, adjust for your DB
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function updateUserPasswordByEmail(email: string, newHash: string) {
    return await prisma.user.update({
      where: { email },
      data: { passwordHash: newHash },
    });
  }
  export async function getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }
