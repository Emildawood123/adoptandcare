"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // <-- add
  const [isVet, setIsVet] = useState(false);     // <-- add
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  // Validate form fields
  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "", phone: "", address: "" };

    if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
      valid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
      valid = false;
    }

    if (address.length < 5) {
      newErrors.address = "Address must be at least 5 characters long.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    if ((isAdmin || isVet) && pin !== "123456") {
      toast.error("Invalid PIN code for admin/vet registration.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, address, isAdmin, isVet }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration successful! Redirecting to login...");
        router.push("/login");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
          <h2 className="mt-6 text-2xl font-bold text-blue-700">Join Us!</h2>
          <p className="text-blue-600 mt-2 text-center">
            Create your account and start your journey with Adopt & Care.
          </p>
        </div>
        {/* Right: Register Form */}
        <div className="flex-1 flex flex-col justify-center p-8">
          <div className="mb-8 flex flex-col items-center">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
              alt="Logo"
              width={60}
              height={60}
              className="mb-2"
            />
            <h2 className="text-3xl font-extrabold text-blue-700 mb-2">Register</h2>
            <p className="text-gray-500">Create your Adopt & Care account</p>
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            {/* Password Field */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            {/* Phone Field */}
            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            {/* Address Field */}
            <div>
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
            {/* Admin/Vet Checkboxes */}
            <div className="flex items-center space-x-6 mb-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={e => setIsAdmin(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className="text-sm">Register as Admin</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isVet}
                  onChange={e => setIsVet(e.target.checked)}
                  className="accent-pink-500"
                />
                <span className="text-sm">Register as Vet</span>
              </label>
            </div>
            {/* PIN Field for Admin/Vet */}
            {(isAdmin || isVet) && (
              <div>
                <input
                  type="password"
                  placeholder="Enter 6-digit PIN code"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  maxLength={6}
                  required
                />
              </div>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-pink-400 text-white p-3 rounded-lg font-bold text-lg shadow-lg hover:from-blue-600 hover:to-pink-500 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          {/* Login Link */}
          <p className="text-xs mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 underline font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
