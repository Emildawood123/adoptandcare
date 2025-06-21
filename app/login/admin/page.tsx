"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/home"); // Redirect to authenticated home
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-pink-100">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl">
        {/* Left: Image */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-pink-200 to-blue-200 p-8 w-1/2">
          <Image
            src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80"
            alt="Cute pet"
            width={320}
            height={320}
            className="rounded-2xl shadow-lg object-cover"
          />
          <h2 className="mt-6 text-2xl font-bold text-blue-700">Welcome Back!</h2>
          <p className="text-blue-600 mt-2 text-center">
            Sign in to continue your journey with Adopt & Care.
          </p>
        </div>
        {/* Right: Login Form */}
        <div className="flex-1 flex flex-col justify-center p-8">
          <div className="mb-8 flex flex-col items-center">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
              alt="Logo"
              width={60}
              height={60}
              className="mb-2"
            />
            <h2 className="text-3xl font-extrabold text-blue-700 mb-2">Admin, Doctor Login</h2>
            <p className="text-gray-500">Welcome to Adopt & Care</p>
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-pink-400 text-white p-3 rounded-lg font-bold text-lg shadow-lg hover:from-blue-600 hover:to-pink-500 transition disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-xs mt-6 text-center">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 underline font-semibold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
