import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import  User  from "@/models/User";  // Adjust the path to your User schema
import { dbConnect } from "@/app/lib/mongodb";
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
        await dbConnect();
        
        const user = await User.findOne({ email: credentials?.email }).select("+password");
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid email or password");
        }

        return { id: user._id, name: user.name, email: user.email, phone: user.phoneNumber, address: user.address, pets: user.pets, avater: user.avater }; // Return user data
      },
    }),
  ],
  session: {
    strategy: "jwt",  // Store session as JWT
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
        token.pets = user.pets
        token.avater = user.avater
      }
      return token;
    },
    async session({ session, token }) {
      // On every session request, attach JWT data to the session
      if (token) {
        session.user._id = token._id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.phone = token.phone
        session.user.address = token.address;
        session.user.pets = token.pets
        session.avater = token.avater
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,  // Store your secret in environment variables
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
