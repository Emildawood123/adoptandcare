"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PetList } from "../../components/PetList";
import CreatePetForm from "@/components/createPetForm";
import ProductSection from "@/components/ProductList";
import AdminAdoptionRequests from "@/components/AdminAdoptionRequests";
import MyOrders from "@/components/MyOrders";
import AdminOrders from "@/components/AdminOrders";

type Pet = {
  _id: string;
  name: string;
  image: string;
  age: number;
  breed: string;
  description?: string;
};

type Product = {
  _id: string;
  name: string;
  image: string;
  description?: string;
};

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = searchParams.get("name") || "Pets";
  const { data: session, status } = useSession();
  const isAdmin = session?.user.email === "admin@admin.com";
  const [newPet, setNewPet] = useState({ name: "", image: "", description: "", age: "", breed: "" });
  const [loading, setLoading] = useState(false);

  // State for pets
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    const fetchPets = async () => {
      if (selectedPage === "Pets") {
        try {
          const res = await fetch("/api/pets");
          const data = await res.json();
          setPets(data);
        } catch (error) {
          console.error("Error fetching pets:", error);
        }
      }
    };
    fetchPets();
  }, [selectedPage]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedPage === "Products") {
        try {
          const res = await fetch("/api/products");
          const data = await res.json();
          setProducts(data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };
    fetchProducts();
  }, [selectedPage]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setNewPet((prev) => ({ ...prev, image: reader.result as string }));
    };
  };

  const handleCreatePet = async () => {
    if (!newPet.name || !newPet.image) {
      alert("Name and image are required!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", newPet.name);
    formData.append("description", newPet.description);
    formData.append("user", session?.user._id);
    formData.append("age", newPet.age);
    formData.append("breed", newPet.breed);

    const fileBlob = await fetch(newPet.image)
      .then((res) => res.blob())
      .catch((error) => console.error("Error fetching image:", error));

    if (fileBlob) {
      formData.append("file", fileBlob);
    }

    const response = await fetch("/api/pets", { method: "POST", body: formData });

    if (response.ok) {
      alert("Pet created successfully!");
      setNewPet({ name: "", image: "", description: "", age: "", breed: "" });
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || "Failed to create pet"}`);
    }
    setLoading(false);
    location.reload();
  };

  const handleDeletePet = async (petId: string, userId: string) => {
    const response = await fetch(`/api/pets/${petId}/${userId}`, { method: "DELETE" });

    if (response.ok) {
      alert("Pet deleted successfully!");
      setPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
      location.reload();
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || "Failed to delete pet"}`);
    }
  };

  const handleEditPet = (petId: string) => {
    if (petId) {
      setSelectedPet(petId);
      setIsModalOpen(true);
    }
  };

  let sections = ["Pets", "Products", "My Orders"];
  if (isAdmin) {
    sections = ["Pets", "Products", "Orders","adoption request"];
  }
{ console.log(session?.user)}
  return (
    <>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 fixed w-full h-[50px] bg-white shadow-md z-50">
        <p className="text-xl font-bold text-blue-600">Adopt and care</p>
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
              src={session?.user?.avater || "/free-user-icon-3296-thumb.png"}
              width={40}
              height={40}
              alt="user"
              className="rounded-full cursor-pointer"
            />
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <main className="relative top-[50px] min-h-screen bg-gray-100 p-5">
        {selectedPage === "Pets" && !isAdmin && (
          <PetList pets={pets} isAdmin={isAdmin} handleDeletePet={handleDeletePet} handleEditPet={handleEditPet} session={session} />
        )}
        {selectedPage === "Pets" && isAdmin && (
          <>
            <CreatePetForm
              newPet={newPet}
              handleChange={handleChange}
              handleImageUpload={handleImageUpload}
              handleCreatePet={handleCreatePet}
              loading={loading}
            ><PetList pets={pets} isAdmin={isAdmin} handleDeletePet={handleDeletePet} handleEditPet={handleEditPet} session={session} /></CreatePetForm>
            
          </>
        )}

        {selectedPage === "Products" && !isAdmin && (
          <ProductSection session={session} isAdmin={isAdmin} />
        )}

        {selectedPage === "Products" && isAdmin && <ProductSection session={session} isAdmin={isAdmin} />}
        {selectedPage === "Orders" && isAdmin && <AdminOrders session={session} />}
        {selectedPage === "My Orders" && !isAdmin && (
          <>
            <MyOrders session={session} />  </>
          
          )}
       
        {selectedPage === "adoption request" && (
          <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminAdoptionRequests />
    </div>
        )}
      </main>
      <footer className="bg-gray-800 text-white py-8 mt-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">About PetStore</h3>
            <p className="text-gray-400">
              PetStore is your one-stop destination for all things pets. We provide a platform for pet lovers to connect,
              share, and care for their furry friends.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/home?name=Pets" className="text-gray-400 hover:text-blue-500 transition">
                  Pets
                </a>
              </li>
              <li>
                <a href="/home?name=Products" className="text-gray-400 hover:text-blue-500 transition">
                  Products
                </a>
              </li>
              <li>
                <a href="/home?name=My Pets" className="text-gray-400 hover:text-blue-500 transition">
                  My Pets
                </a>
              </li>
              <li>
                <a href="/setting" className="text-gray-400 hover:text-blue-500 transition">
                  Settings
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="text-gray-400 space-y-2">
              <li>Email: support@petstore.com</li>
              <li>Phone: +1 (123) 456-7890</li>
              <li>Address: 123 Pet Street, Pet City, PC 12345</li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 border-t border-gray-700 pt-8 flex justify-center space-x-6">
          <a href="https://facebook.com" className="text-gray-400 hover:text-blue-500 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </a>
          <a href="https://twitter.com" className="text-gray-400 hover:text-blue-500 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </a>
          <a href="https://instagram.com" className="text-gray-400 hover:text-blue-500 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-400">
          &copy; {new Date().getFullYear()} PetStore. All rights reserved.
        </div>
      </div>
    </footer>
    </>
  );
};

export default Navbar;
