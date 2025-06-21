"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = searchParams.get("name") || "Pets";
  const { data: session, status } = useSession();
  const isAdmin = session?.user.email === "admin@admin.com";
  // Define sections based on user role
  let sections = ["Pets", "Products", "My Orders"];
  if (isAdmin) {
    sections = ["Pets", "Products", "Orders", "adoption request"];
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 fixed w-full h-[50px] bg-white shadow-md z-50">
      <p className="text-xl font-bold text-blue-600">Adopt and Care</p>
      <ul className="flex space-x-6">
        {sections.map((page) => (
          <li key={page}>
            <button
              onClick={() => router.push(`/home?name=${page}`, { scroll: false })}
              className={`hover:text-blue-600 transition ${
                selectedPage === page ? "text-blue-600 font-bold" : "text-gray-700"
              }`}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => signOut()}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
        <Link href="/setting">
          <Image
            src={session?.user?.avatar || "/free-user-icon-3296-thumb.png"}
            width={40}
            height={40}
            alt="user"
            className="rounded-full cursor-pointer"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
