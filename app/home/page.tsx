"use client";
import { FaMapMarkerAlt } from "react-icons/fa";
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
import Cart from "@/components/Cart";
import { PetClinic } from "@/components/petClinic";
import { AdminPetClinic } from "@/components/AdminPetClinic";
import toast from "react-hot-toast";

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
  quantity?: number; // Add this property'
  isAdmin?: boolean; // Add this property to indicate if the user is an admin
  isVet?: boolean; // Add this property to indicate if the user is a vet
};

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = searchParams.get("name") || "Pets";
  const { data: session, status } = useSession();
  const isAdmin = session?.user.isAdmin
  const isVet = session?.user.isVet
  console.log(isVet, "isVet from home page");
  const [newPet, setNewPet] = useState({ name: "", image: "", description: "", age: "", breed: "" });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    quantity: 1,
  });
  const [productLoading, setProductLoading] = useState(false);
  const [editPet, setEditPet] = useState<Pet | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [vets, setVets] = useState<any[]>([]); // Add vets state

  const handleModalClose = () => setIsModalOpen(false);

  // Fetch pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("/api/pets");
        if (!res.ok) throw new Error(`Failed to fetch pets: ${res.statusText}`);
        const text = await res.text();
        if (!text) throw new Error("Empty response from server");
        const data = JSON.parse(text);
        setPets(data);
      } catch (error) {
        console.error("Error fetching pets:", error);
        alert("Failed to fetch pets. Please try again.");
      }
    };
    fetchPets();
  }, [selectedPage]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const responseText = await res.text();
        if (res.ok) {
          if (res.headers.get("content-type")?.includes("application/json")) {
            const data = JSON.parse(responseText);
            setProducts(data);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (session?.user?._id) {
        try {
          const res = await fetch(`/api/users/${session.user._id}`);
          if (!res.ok) throw new Error("Failed to fetch user avatar");
          const data = await res.json();
          setAvatar(data.avatar);
        } catch (error) {
          console.error("Error fetching user avatar:", error);
        }
      }
    };
    fetchUserAvatar();
  }, [session?.user?._id, setAvatar]);

  // Fetch vets for pet clinic page
  useEffect(() => {
    if (selectedPage === "pet clinic") {
      const fetchVets = async () => {
        try {
          const res = await fetch("/api/users?isVet=true");
          if (!res.ok) throw new Error("Failed to fetch vets");
          const data = await res.json();
          setVets(data);
        } catch (error) {
          console.error("Error fetching vets:", error);
          setVets([]);
        }
      };
      fetchVets();
    }
  }, [selectedPage]);
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [status, session, router]);
  
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null;

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setNewPet((prev) => ({ ...prev, image: reader.result as string }));
    };
  };

  // Handle pet creation
  const handleCreatePet = async () => {
    if (!newPet.name || !newPet.image) {
      alert("Name and image are required!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", newPet.name);
      formData.append("description", newPet.description);
      formData.append("age", newPet.age);
      formData.append("breed", newPet.breed);

      const fileBlob = await fetch(newPet.image)
        .then((res) => res.blob())
        .catch((error) => {
          console.error("Error fetching image:", error);
          throw error;
        });

      if (fileBlob) {
        formData.append("file", fileBlob);
      }

      const response = await fetch("/api/pets", {
        method: "POST",
        body: formData,
      });

      // Log the response for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      const responseText = await response.text();
      console.log("Response body:", responseText);

      if (response.ok) {
        // Parse JSON only if the response is OK and has JSON content
        if (response.headers.get("content-type")?.includes("application/json")) {
          const data = JSON.parse(responseText);
          console.log("Pet created:", data);
          alert("Pet created successfully!");
          setNewPet({ name: "", image: "", description: "", age: "", breed: "" });
          location.reload();
        } else {
          alert("Unexpected response format from the server.");
        }
      } else {
        alert(`Error: ${responseText || "Failed to create pet"}`);
      }
    } catch (error) {
      console.error("Error creating pet:", error);
      alert("An error occurred while creating the pet.");
    } finally {
      setLoading(false);
    }
  };
  // Open modal for editing
  const handleEditPet = (id: number) => {
    const petToEdit = pets.find((pet) => pet.id === id);
    if (petToEdit) {
      setEditPet(petToEdit);
      setIsModalOpen(true);
    }
  };
  // Delete pet
  const handleDeletePet = async (id: number) => {
    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: "DELETE",
      });
      const responseText = await response.text();
      if (response.ok) {
        if (response.headers.get("content-type")?.includes("application/json")) {
          alert("Pet deleted successfully!");
          setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
        } else {
          alert("Unexpected response format from the server.");
        }
      } else {
        alert(`Error: ${responseText || "Failed to delete pet"}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the pet.");
    }
  };

  // Update pet details
  const handleUpdatePet = async () => {
    if (!editPet) return;
    setEditLoading(true);
    try {
      const res = await fetch(`/api/pets/${editPet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editPet),
      });
      if (res.ok) {
        alert("Pet updated successfully!");
        setIsModalOpen(false);
        setEditPet(null);
        // Refresh pets list
        const refreshed = await fetch("/api/pets");
        if (refreshed.ok) {
          const data = await refreshed.json();
          setPets(data);
        }
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update pet.");
      }
    } catch {
      alert("Failed to update pet.");
    } finally {
      setEditLoading(false);
    }
  };

  // Define sections based on user role
  let sections = ["Pets", "Products", "My Orders", "Cart", "pet clinic"];
  if (isAdmin) {
    sections = ["Pets", "Products", "Orders", "adoption request" ];
  }
  if (isVet) {
    sections = ["Pets", "Products", "vet consultation request"];
  }

  // Handle new product input changes
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  // Handle new product image upload
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setNewProduct((prev) => ({ ...prev, image: reader.result as string }));
    };
  };

  // Handle new product creation
  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image || newProduct.quantity === undefined) {
      alert("Name, price, image, and quantity are required!");
      return;
    }
    setProductLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Product created successfully!");
        setNewProduct({ name: "", price: "", image: "", description: "", quantity: 1 });
        // Refresh products list
        const refreshed = await fetch("/api/products");
        if (refreshed.ok) {
          const products = await refreshed.json();
          setProducts(products);
        }
      } else {
        alert(data.message || "Failed to create product.");
      }
    } catch {
      alert("Failed to create product.");
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 fixed w-full h-[60px] bg-white shadow-lg z-50">
        <div className="flex items-center space-x-3">
          <Image src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80" alt="Logo" width={50} height={60} className="rounded-full" />
          <span className="text-2xl font-extrabold text-blue-700 tracking-tight">Adopt & Care</span>
        </div>
        <ul className="flex space-x-8">
          {sections.map((page) => (
            <li key={page}>
              <button
                onClick={() => router.push(`/home?name=${page}`, { scroll: false })}
                className={`hover:text-blue-600 transition text-lg ${
                  selectedPage === page ? "text-blue-600 font-bold underline underline-offset-8" : "text-gray-700"
                }`}
              >
                {page}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
        <a
  href="https://www.google.com/maps/search/veterinarian+near+me"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition ml-2 font-semibold text-blue-700 shadow"
  title="Find Nearest Veterinarians"
>
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
            find near veterinarians
</a>
          <Link href="/setting">
            <Image
              src={avatar || "/free-user-icon-3296-thumb.png"}
              width={44}
              height={44}
              alt="user"
              className="rounded-full cursor-pointer border-2 border-blue-400"
            />
          </Link>
          
          <button
            onClick={() => signOut()}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-blue-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative w-full h-[350px] flex flex-col items-center justify-center text-center bg-cover bg-center rounded-b-3xl shadow-lg"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black/50 rounded-b-3xl"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
            Welcome, {session.user.name || session.user.email}!
          </h1>
          <p className="text-lg md:text-xl mt-4 font-medium drop-shadow-lg">
            Explore, adopt, and care for your new best friend.
          </p>
        </div>
      </section>

      {/* Page Content */}
      <main className="relative min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-6">
        {/* Pets Section */}
        {selectedPage === "Pets" && (
          <section className="container mx-auto py-12 px-2 text-center">
            <h2 className="text-3xl font-extrabold text-pink-700 mb-8">Meet Our Lovely Pets</h2>
            
            {/* Show CreatePetForm before the pets grid */}
            {isAdmin && (
              <CreatePetForm
                newPet={newPet}
                handleChange={handleChange}
                handleImageUpload={handleImageUpload}
                handleCreatePet={handleCreatePet}
                loading={loading}
              />
            )}

            <div className="mt-8 grid md:grid-cols-3 lg:grid-cols-3 gap-10">
              {pets.length > 0 ? (
                pets.map((pet) => (
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
                    {/* Adoption Request Button for users */}
                    {!isAdmin && (
                      <button
                        className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold shadow hover:from-pink-600 hover:to-blue-600 transition"
                        onClick={async () => {
                          const message = prompt(`Why do you want to adopt ${pet.name}?`);
                          if (!message) return;
                          try {
                            const res = await fetch("/api/adoptionRequests", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                petId: pet.id,
                                userId: session.user._id,
                                message,
                              }),
                            });
                            if (res.ok) {
                              alert("Adoption request sent!");
                            } else {
                              const data = await res.json();
                              alert(data.message || "Failed to send adoption request.");
                            }
                          } catch {
                            alert("Failed to send adoption request.");
                          }
                        }}
                      >
                        Request Adoption
                      </button>
                    )}
                    {isAdmin && (
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => handleEditPet(pet.id)}
                          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePet(pet.id)}
                          className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-xl text-gray-500 py-10">
                  No pets found in our database. Please check back later!
                </div>
              )}
            </div>
          </section>
        )}

        {/* Products Section */}
        {selectedPage === "Products" && (
          <section className="container mx-auto py-12 px-2 text-center">
            <h2 className="text-3xl font-extrabold text-blue-700 mb-8">Our Products</h2>
            {/* Admin Add Product Form */}
            {isAdmin && (
              <div className="mb-10 max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-700">Add New Product</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={handleProductChange}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={handleProductChange}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={handleProductChange}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    min={1}
                    value={newProduct.quantity}
                    onChange={handleProductChange}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="w-full"
                  />
                  {newProduct.image && (
                    <img
                      src={newProduct.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl mx-auto border mt-2"
                    />
                  )}
                  <button
                    type="button"
                    onClick={handleCreateProduct}
                    disabled={productLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-pink-400 text-white rounded-lg font-bold text-lg shadow-lg hover:from-blue-600 hover:to-pink-500 transition disabled:opacity-60"
                  >
                    {productLoading ? "Adding..." : "Add Product"}
                  </button>
                </div>
              </div>
            )}
            <div className="mt-8 grid md:grid-cols-3 gap-10">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdmin={isAdmin}
                    userId={session.user._id}
                  />
                ))
              ) : (
                <div className="col-span-3 text-xl text-gray-500 py-10">
                  No products found in our database. Please check back later!
                </div>
              )}
            </div>
          </section>
        )}

        {/* Orders, Cart, Clinic, etc. */}
        {selectedPage === "Orders" && isAdmin && <AdminOrders session={session} />}
        {selectedPage === "My Orders" && !isAdmin && <MyOrders session={session} />}
        {selectedPage === "adoption request" && isAdmin && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <AdminAdoptionRequests />
          </div>
        )}
        {selectedPage === "Cart" && <Cart userId={session.user._id} />}
        {selectedPage === "pet clinic" && (
          <section className="container mx-auto py-12 px-2 text-center">
            <h2 className="text-3xl font-extrabold text-blue-700 mb-8">Our Veterinarians</h2>
            <div className="mt-8 grid md:grid-cols-3 gap-10">
              {vets.length > 0 ? (
                vets.map((vet) => (
                  <div key={vet.id} className="bg-white p-6 shadow-xl rounded-2xl flex flex-col items-center">
                    <Image
                      src={vet.avatar || "/free-user-icon-3296-thumb.png"}
                      width={120}
                      height={120}
                      alt={vet.name || vet.email}
                      className="rounded-full object-cover mb-4"
                    />
                    <h3 className="text-xl font-bold">Doctor name: {vet.name || vet.email}</h3>
                    <p className="text-gray-600">email: {vet.email}</p>
                    <p className="text-gray-500">Address: {vet.address}</p>
                     {/* Consult Request Button */}
            <button
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-pink-600 transition"
              onClick={async () => {
                const message = prompt(`Enter your consultation request for Dr. ${vet.name || vet.email}:`);
                if (!message) return;
                try {
                  const res = await fetch("/api/vet-consultations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId: session.user._id,
                      // message: message,
                      requestedDate: new Date().toISOString(),
                      vetId: vet.id,
                    }),
                  });
                  if (res.ok) {
                    toast.success("Consultation request sent!");
                  } else {
                    const data = await res.json();
                    toast.error(data.message || "Failed to send consultation request.");
                  }
                } catch {
                  toast.error("Failed to send consultation request.");
                }
              }}
            >
              Consult Request
            </button>
                    {/* Add more vet info or actions here */}
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-xl text-gray-500 py-10">
                  No veterinarians found.
                </div>
              )}
            </div>
          </section>
        )}
        {selectedPage === "vet consultation request" && isVet && <AdminPetClinic session={session} />}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-700 to-pink-700 text-white py-10 mt-8 rounded-t-3xl shadow-lg">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">About Adopt and Care</h3>
              <p className="text-gray-200">
                Adopt and Care is your one-stop destination for all things pets. We provide a platform for pet lovers to connect,
                share, and care for their furry friends.
              </p>
            </div>
            {/* Quick Links Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/home?name=Pets" className="text-gray-200 hover:text-yellow-300 transition">
                    Pets
                  </a>
                </li>
                <li>
                  <a href="/home?name=Products" className="text-gray-200 hover:text-yellow-300 transition">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/home?name=My Orders" className="text-gray-200 hover:text-yellow-300 transition">
                    My Orders
                  </a>
                </li>
                <li>
                  <a href="/setting" className="text-gray-200 hover:text-yellow-300 transition">
                    Settings
                  </a>
                </li>
              </ul>
            </div>
            {/* Contact Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="text-gray-200 space-y-2">
                <li>Email: support@adoptandcare.com</li>
                <li>Phone: +1 (123) 456-7890</li>
                <li>Address: 123 Pet Street, Pet City, PC 12345</li>
              </ul>
            </div>
          </div>
          {/* Social Media Links */}
          <div className="mt-8 border-t border-blue-400 pt-8 flex justify-center space-x-6">
            <a href="https://facebook.com" className="text-gray-200 hover:text-yellow-300 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a href="https://twitter.com" className="text-gray-200 hover:text-yellow-300 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="https://instagram.com" className="text-gray-200 hover:text-yellow-300 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
          {/* Copyright */}
          <div className="mt-8 text-center text-gray-200">
            &copy; {new Date().getFullYear()} Adopt and Care. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Edit Pet Modal */}
      {isModalOpen && editPet && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-md w-full relative">
            {/* X Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditPet(null);
              }}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleUpdatePet();
              }}
            >
              <h2 className="text-xl font-bold mb-4">Edit Pet</h2>
              <input
                type="text"
                name="name"
                placeholder="Pet Name"
                value={editPet.name}
                onChange={e => setEditPet(prev => prev && { ...prev, name: e.target.value })}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={editPet.age}
                onChange={e => setEditPet(prev => prev && { ...prev, age: Number(e.target.value) })}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                name="breed"
                placeholder="Breed"
                value={editPet.breed}
                onChange={e => setEditPet(prev => prev && { ...prev, breed: e.target.value })}
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={editPet.description}
                onChange={e => setEditPet(prev => prev && { ...prev, description: e.target.value })}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    setEditPet(prev => prev && { ...prev, image: reader.result as string });
                  };
                }}
                className="w-full mb-2"
              />
              {editPet.image && (
                <img
                  src={editPet.image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl mx-auto border mb-2"
                />
              )}
              <button
                type="submit"
                disabled={editLoading}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {editLoading ? "Updating..." : "Update Pet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

// Add this inside your Navbar component (not outside)
function ProductCard({ product, isAdmin, userId }: { product: Product; isAdmin: boolean; userId: string }) {
  const [count, setCount] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editProduct, setEditProduct] = useState<Pet | null>({ ...product });
  const [editLoading, setEditLoading] = useState(false);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });
      if (res.ok) {
        alert("Product updated!");
        setEditMode(false);
        window.location.reload(); // Refresh the page to see changes
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update product.");
      }
    } catch {
      alert("Failed to update product.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setEditLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Product deleted!");
        window.location.reload()
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete product.");
      }
    } catch {
      alert("Failed to delete product.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow-xl rounded-2xl hover:scale-105 transition flex flex-col items-center">
      {editMode ? (
        <>
          <input
            type="text"
            name="name"
            value={editProduct.name}
            onChange={handleEditChange}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="number"
            name="quantity"
            value={editProduct.quantity}
            onChange={handleEditChange}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            name="description"
            value={editProduct.description}
            onChange={handleEditChange}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleEditSave}
            disabled={editLoading}
            className="px-4 py-1 bg-green-500 text-white rounded mr-2"
          >
            {editLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="px-4 py-1 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <Image
            src={product.image || "https://images.unsplash.com/photo-1518715308788-3005759c61d4?auto=format&fit=crop&w=400&q=80"}
            width={320}
            height={220}
            alt={product.name}
            className="rounded-xl object-cover"
          />
          <h3 className="mt-4 text-2xl font-bold">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-sm text-blue-700 mt-2 font-semibold">
            Available Quantity: {product.quantity ?? "N/A"}
          </p>
          {/* Counter */}
          {!isAdmin && (
            <div className="flex items-center mt-4 space-x-2">
              <button
                type="button"
                className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full font-bold text-lg hover:bg-blue-300 transition"
                onClick={() => setCount((c) => Math.max(1, c - 1))}
                disabled={count <= 1}
              >
                -
              </button>
              <span className="px-4 py-1 border rounded-lg bg-gray-50 text-lg font-semibold">{count}</span>
              <button
                type="button"
                className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full font-bold text-lg hover:bg-blue-300 transition"
                onClick={() => setCount((c) => Math.min((product.quantity ?? 99), c + 1))}
                disabled={product.quantity !== undefined && count >= product.quantity}
              >
                +
              </button>
            </div>
          )}
          {/* Add to Cart Button for users */}
          {!isAdmin && (
            <button
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-pink-600 transition"
              onClick={async () => {
                try {
                  const res = await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      productId: product.id,
                      userId,
                      quantity: count,
                    }),
                  });
                  if (res.ok) {
                    alert("Product added to cart!");
                  } else {
                    const data = await res.json();
                    alert(data.message || "Failed to add product to cart.");
                  }
                } catch {
                  alert("Failed to add product to cart.");
                }
              }}
              disabled={product.quantity !== undefined && count > product.quantity}
            >
              Add to Cart
            </button>
          )}
          {/* Admin Edit/Delete */}
          {isAdmin && (
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                disabled={editLoading}
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
