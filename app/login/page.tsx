"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      console.log("aa")
      router.push("/home"); // Redirect to authenticated home
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <div className="p-6 border rounded-lg shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full p-2 border rounded" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input className="w-full p-2 border rounded" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
           {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-xs mt-[10px]">don't you have account? <Link href="/register" className="text-blue underline">here</Link></p>
      </div>
      
    </div>
  );
}
