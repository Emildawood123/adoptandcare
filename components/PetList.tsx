"use client";

import { useState } from "react";
import EditPetModal from "./EditPetModal"; // Ensure the correct import path

type Pet = {
  id: number;
  name: string;
  breed: string;
  age: number;
  location: string;
  image: string;
  description: string;
  availableForAdoption: boolean;
  user: { name: string }; // Add user information
};

export const PetList = ({ pets, isAdmin, handleDeletePet, session }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [messages, setMessages] = useState<{ [key: number]: string }>({});

  // Handle adoption request
  const handleAdopt = async (petId: number) => {
    const message = messages[petId];
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
        location.reload()
        setMessages((prevMessages) => ({ ...prevMessages, [petId]: "" }));
      } else {
        const contentType = res.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const error = await res.json();
          alert(`Error: ${error.message || "Failed to submit request"}`);
        } else {
          alert("Failed to submit request");
          location.reload()
        }
      }
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      alert("An error occurred while submitting the request.");
    }
  };

  // Handle pet editing
  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPet(null);
  };

  // Handle modal confirm (after editing)
  const handleModalConfirm = (updatedPet: Pet) => {
    // Update the pet in the state
    setSelectedPet(updatedPet);
    handleModalClose();
  };

  // Handle message change
  const handleMessageChange = (petId: number, newMessage: string) => {
    setMessages((prevMessages) => ({ ...prevMessages, [petId]: newMessage }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map((pet) => (
        <div
          key={pet.id}
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
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleDeletePet(pet.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm opacity-90 hover:opacity-100 transition"
                >
                  ✖ Delete
                </button>
                <button
                  onClick={() => handleEditPet(pet)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm opacity-90 hover:opacity-100 transition"
                >
                  ✏ Edit
                </button>
              </div>
            )}
          </div>

          {/* Pet Info */}
          <div className="mt-4">
            <h2 className="text-xl font-bold text-gray-800">{pet.name}</h2>
            <p className="text-sm text-gray-600 mt-1">Breed: {pet.breed}</p>
            <p className="text-sm text-gray-600">Age: {pet.age} years</p>
            <p className="text-sm text-gray-600">Location: {pet.location}</p>
            <p className="text-sm text-gray-600 mt-2">{pet.description}</p>
            <p className="text-sm text-gray-600">
              Status: {pet.availableForAdoption ? "Available" : "Not Available"}
            </p>
          </div>

          {/* Adoption Request Button (for non-admin users) */}
          {!isAdmin && pet.availableForAdoption && (
            <div className="mt-4">
              <textarea
                placeholder="Why do you want to adopt this pet?"
                value={messages[pet.id] || ""}
                onChange={(e) => handleMessageChange(pet.id, e.target.value)}
                className="w-full p-2 border rounded-md mb-2"
                rows={3}
              />
              <button
                onClick={() => handleAdopt(pet.id)}
                className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Adopt Me
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Edit Pet Modal */}
      <EditPetModal
        isOpen={isModalOpen}
        pet={selectedPet}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};
