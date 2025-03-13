import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    // Credentials authentication (email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find the user in the PostgreSQL database using Prisma
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Compare the provided password with the hashed password in the database
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // Return user data (excluding sensitive fields like passwordHash)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          pets: user.pets,
          avatar: user.avatar,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Store session as JWT
  },
  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, store the user data in the JWT
      if (user) {
        token._id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.address = user.address;
        token.pets = user.pets;

      }
      return token;
    },
    async session({ session, token }) {
      // On every session request, attach JWT data to the session
      if (token) {
        session.user._id = token._id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.phone = token.phone;
        session.user.address = token.address;
        session.user.pets = token.pets;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Store your secret in environment variables
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
