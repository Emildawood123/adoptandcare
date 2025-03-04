"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
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

  const validateForm = () => {
    let valid = true;
    let newErrors = { name: "", email: "", password: "", phone: "", address: "" };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (validateForm()) {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, address, phone }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Registration successful! Redirecting to login...");
        router.push("/login");
      } else {
        setError(data.message || "Something went wrong");
      }
    } else {
      setLoading(false)
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 border rounded-lg shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          <input
            type="tel"
            placeholder="phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          <input
            type="text"
            placeholder="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-xs mt-[10px]">if you have account go to <Link href="/login" className="underline text-blue">here</Link></p>
      </div>
    </div>
  );
}
