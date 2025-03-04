"use client";

import { useState } from "react";

type Pet = {
  _id: string;
  name: string;
  breed: string;
  age: number;
  location: string;
  image: string;
  description: string;
  availableForAdoption: boolean;
  user: { name: string }; // Add user information
};

export const PetList = ({ pets, isAdmin, handleDeletePet, handleEditPet, session }) => {
  const [message, setMessage] = useState("");

  // Handle adoption request
  const handleAdopt = async (petId: string) => {
    if (!message) {
      alert("Please enter a message");
      return;
    }

    try {
      const res = await fetch("/api/adoptionRequests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId, userId: session?.user?._id, message }),
      });

      if (res.ok) {
        alert("Adoption request submitted!");
        setMessage("");
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || "Failed to submit request"}`);
      }
    } catch (error) {
      alert("An error occurred while submitting the request.");
    }
  };

  return (
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
     {pets.map((pet) => (
  <div
    key={pet._id}
    className="bg-white p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
  >
    {/* Pet Image */}
    <div className="relative">
      <img
        src={pet.image}
        alt={pet.name}
        className="w-full h-48 object-cover rounded-lg shadow-md"
      />
      {/* Admin Actions Overlay */}
           {isAdmin && (
             
             <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={() => handleDeletePet(pet._id, session?.user?._id)}
            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm opacity-90 hover:opacity-100 transition"
          >
            ✖ Delete
          </button>
          <button
            onClick={() => handleEditPet(pet._id)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm opacity-90 hover:opacity-100 transition"
          >
            ✏ Edit
          </button>
               </div>
          </div>
      )}
    </div>

    {/* Pet Info */}
    <div className="mt-4">
      <h2 className="text-xl font-bold text-gray-800">{pet.name}</h2>
      <p className="text-sm text-gray-600 mt-1">Breed: {pet.breed}</p>
      <p className="text-sm text-gray-600">Age: {pet.age} years</p>
      <p className="text-sm text-gray-600 mt-2">{pet.description}</p>
    </div>

    {/* Adoption Request Button (for non-admin users) */}
    {!isAdmin && (
      <div className="mt-4">
        <textarea
          placeholder="Why do you want to adopt this pet?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded-md mb-2"
          rows={3}
        />
        <button
          onClick={() => handleAdopt(pet._id)}
          className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Adopt Me
        </button>
      </div>
    )}
  </div>
))}
    </div>
  );
};
