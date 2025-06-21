"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Pet = {
  id: number;
  name: string;
  image: string;
  age: number;
  breed: string;
  description?: string;
};

type Product = {
  id: number;
  name: string;
  image: string;
  description?: string;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Redirect if signed in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [status, router]);

  // Fetch pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("/api/pets");
        if (!res.ok) throw new Error("Failed to fetch pets");
        const data = await res.json();
        setPets(data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchPets();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  if (status === "loading") return <p>Loading...</p>;
  if (status !== "unauthenticated") return null;

  return (
    <main className="bg-gradient-to-br from-blue-50 to-pink-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex flex-col items-center justify-center text-center bg-cover bg-center rounded-b-3xl shadow-lg"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80')"
        }}>
        <div className="absolute inset-0 bg-black/60 rounded-b-3xl"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">Find Your Furry Friend</h1>
          <p className="text-xl md:text-2xl mt-6 font-medium drop-shadow-lg">
            Adopt a pet & give them a forever home.
          </p>
          <Link href="/login">
            <button className="mt-8 px-8 py-4 bg-yellow-400 text-black font-bold rounded-full shadow-lg hover:bg-yellow-500 transition text-lg">
              Sign In to Adopt
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-20 px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-10 text-blue-700">Why Adopt From Us?</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-10">
          <div className="p-8 bg-white shadow-xl rounded-2xl flex flex-col items-center hover:scale-105 transition">
            <Image src="https://cdn-icons-png.flaticon.com/512/616/616408.png" width={80} height={80} alt="Healthy" />
            <h3 className="text-2xl font-semibold mt-4">Healthy & Vaccinated</h3>
            <p className="mt-2 text-gray-600">All pets are health-checked and vaccinated by professionals.</p>
          </div>
          <div className="p-8 bg-white shadow-xl rounded-2xl flex flex-col items-center hover:scale-105 transition">
            <Image src="https://cdn-icons-png.flaticon.com/512/616/616408.png" width={80} height={80} alt="Shelter" />
            <h3 className="text-2xl font-semibold mt-4">Rescue & Shelter Support</h3>
            <p className="mt-2 text-gray-600">We support shelters by finding loving homes for rescued pets.</p>
          </div>
          <div className="p-8 bg-white shadow-xl rounded-2xl flex flex-col items-center hover:scale-105 transition">
            <Image src="https://cdn-icons-png.flaticon.com/512/616/616408.png" width={80} height={80} alt="Easy" />
            <h3 className="text-2xl font-semibold mt-4">Easy Adoption Process</h3>
            <p className="mt-2 text-gray-600">Our adoption process is quick, smooth, and transparent.</p>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="bg-gradient-to-r from-pink-100 to-blue-100 py-20 px-6 text-center rounded-3xl mx-4 shadow-lg">
        <h2 className="text-4xl font-extrabold text-pink-700 mb-10">Meet Our Lovely Pets</h2>
        <div className="mt-10 grid md:grid-cols-3 lg:grid-cols-3 gap-10">
          {pets.length > 0 ? (
            pets.slice(0, 6).map((pet) => (
              <div key={pet.id} className="bg-white p-6 shadow-xl rounded-2xl hover:scale-105 transition flex flex-col items-center">
                <Image
                  src={pet.image || "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=400&q=80"}
                  width={320}
                  height={220}
                  alt={pet.name}
                  className="rounded-xl object-cover"
                />
                <h3 className="mt-4 text-2xl font-bold">{pet.name}</h3>
                <p className="text-gray-600">{pet.breed} • {pet.age} Years Old</p>
                <p className="text-gray-500 mt-2">{pet.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-xl text-gray-500 py-10">
              No pets found in our database. Please check back later!
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto py-20 px-6 text-center">
        <h2 className="text-4xl font-extrabold text-blue-700 mb-10">Our Products</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-10">
          {products.length > 0 ? products.slice(0, 3).map((product) => (
            <div key={product.id} className="bg-white p-6 shadow-xl rounded-2xl hover:scale-105 transition flex flex-col items-center">
              <Image
                src={product.image || "https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=crop&w=400&q=80"}
                width={320}
                height={220}
                alt={product.name}
                className="rounded-xl object-cover"
              />
              <h3 className="mt-4 text-2xl font-bold">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )) : (
            <>
              <div className="bg-white p-6 shadow-xl rounded-2xl flex flex-col items-center">
                <Image src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" width={320} height={220} alt="Dog Food" className="rounded-xl object-cover" />
                <h3 className="mt-4 text-2xl font-bold">Premium Dog Food</h3>
                <p className="text-gray-600">Nutritious and delicious food for your dog.</p>
              </div>
              <div className="bg-white p-6 shadow-xl rounded-2xl flex flex-col items-center">
                <Image src="https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=crop&w=400&q=80" width={320} height={220} alt="Cat Toy" className="rounded-xl object-cover" />
                <h3 className="mt-4 text-2xl font-bold">Cat Toy</h3>
                <p className="text-gray-600">Fun and safe toys for your playful cat.</p>
              </div>
              <div className="bg-white p-6 shadow-xl rounded-2xl flex flex-col items-center">
                <Image src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" width={320} height={220} alt="Pet Bed" className="rounded-xl object-cover" />
                <h3 className="mt-4 text-2xl font-bold">Comfy Pet Bed</h3>
                <p className="text-gray-600">A cozy bed for your beloved pet to rest.</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-700 to-pink-700 text-white text-center py-8 mt-16 rounded-t-3xl shadow-lg">
        <div className="container mx-auto">
          <p className="text-lg font-semibold">© {new Date().getFullYear()} Adopt & Care. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
