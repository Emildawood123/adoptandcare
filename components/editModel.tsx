"use client";

import { useEffect, useState } from "react";

type Pet = {
  id: number;
  name: string;
  image: string;
  age: number;
  breed: string;
  description?: string;
};

type EditPetModalProps = {
  isOpen: boolean;
  pet: Pet | null;
  onClose: () => void;
  onConfirm: (updatedPet: Pet) => void;
};

const EditPetModal = ({ isOpen, pet, onClose, onConfirm }: EditPetModalProps) => {
  const [updatedPet, setUpdatedPet] = useState<Pet | null>(null);

  // Initialize the form with the current pet data
  useEffect(() => {
  if (pet) {
    setUpdatedPet(pet);
  }
}, [pet]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (updatedPet) {
      setUpdatedPet({ ...updatedPet, [name]: value });
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !updatedPet) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUpdatedPet({ ...updatedPet, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };
console.log(pet)
  // Handle form submission
 const handleSubmit = async () => {
  if (!pet) {
    alert("Invalid pet data. Please try again.");
    return;
  }

  try {
    const response = await fetch(`/api/pets/${pet}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPet),
    });

    if (response.ok) {
      alert("Pet updated successfully!");
      onConfirm(updatedPet); // Notify the parent component
      onClose(); // Close the modal
    } else {
      // Handle error responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to update pet"}`);
      } else {
        const errorText = await response.text();
        alert(`Error: ${errorText || "Failed to update pet"}`);
      }
    }
  } catch (error) {
    console.error("Error updating pet:", error);
    alert("An error occurred while updating the pet.");
  }
};

  if (!isOpen || !updatedPet) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full transform transition-all scale-100 hover:scale-105">
        <h2 className="text-2xl font-semibold mb-4">Edit Pet</h2>

        {/* Pet Name Input */}
        <input
          type="text"
          name="name"
          value={updatedPet.name}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Pet Name"
        />

        {/* Pet Age Input */}
        <input
          type="number"
          name="age"
          value={updatedPet.age}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Pet Age"
        />

        {/* Pet Breed Input */}
        <input
          type="text"
          name="breed"
          value={updatedPet.breed}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Pet Breed"
        />

        {/* Pet Description Input */}
        <textarea
          name="description"
          value={updatedPet.description || ""}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Pet Description"
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 mb-2 border rounded-md"
        />

        {/* Image Preview */}
        {updatedPet.image && (
          <img
            src={updatedPet.image}
            alt="Preview"
            className="w-full h-40 object-cover rounded-md mb-2 shadow-md"
          />
        )}

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPetModal;
