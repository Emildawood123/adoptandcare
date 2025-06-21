"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [avatar, setAvatar] = useState(session?.user?.avatar || "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Require current password for any update
      if (!currentPassword) {
        alert("Please enter your current password to confirm changes.");
        setLoading(false);
        return;
      }

      // First, verify the current password
      const verifyRes = await fetch("/api/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: currentPassword,
          newPassword: password, // Optional, for password change
        }),
      });

      if (!verifyRes.ok) {
        alert("Current password is incorrect. No changes were made.");
        setLoading(false);
        return;
      }

      // If password is correct, proceed to update profile
      const body: any = { name, email, avatar };
      if (password) body.password = password;

      const res = await fetch(`/api/users/${session?.user?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        router.push("/home");
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || "Failed to update profile"}`);
      }
    } catch (error) {
      alert("An error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload
  const handleavatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert image to base64
      reader.onload = () => {
        setAvatar(reader.result as string); // Set base64 string
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center py-10">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={
                avatar ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile Preview"
              className="w-32 h-32 object-cover rounded-full border-4 border-blue-300 shadow-lg"
            />
            <label className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2z"
                />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handleavatarUpload}
                className="hidden"
              />
            </label>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 mt-4">
            Profile Settings
          </h1>
          <p className="text-gray-500">Update your personal information</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Your name"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="you@email.com"
              required
            />
          </div>
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter your current password to confirm"
              autoComplete="current-password"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Required to confirm your identity for any changes.
            </p>
          </div>
          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave blank if you do not want to change your password.
            </p>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-pink-400 text-white rounded-lg font-bold text-lg shadow-lg hover:from-blue-600 hover:to-pink-500 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
