"use client";

import { useEffect, useState } from "react";
import EditPetModal from "./EditPetModal"; // Ensure the correct import path
import PetList from "./PetList"; // Ensure the correct import path

type Pet = {
  id: number;
  name: string;
  image: string;
  age: number;
  breed: string;
  description?: string;
  availableForAdoption: boolean;
};

const defaultPets: Pet[] = [
  {
    id: 1,
    name: "Buddy",
    image: "https://via.placeholder.com/150",
    age: 3,
    breed: "Golden Retriever",
    description: "A friendly and energetic dog.",
    availableForAdoption: true,
  },
  {
    id: 2,
    name: "Mittens",
    image: "https://via.placeholder.com/150",
    age: 2,
    breed: "Siamese Cat",
    description: "A curious and playful cat.",
    availableForAdoption: true,
  },
];

const MyPets = ({ session }) => {
  const [userPets, setUserPets] = useState<Pet[]>(defaultPets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [newPet, setNewPet] = useState({
    name: "",
    image: "",
    description: "",
    age: "",
    breed: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch user's pets
  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const res = await fetch(`/api/pets/user/${session?.user?.id}`);
        if (!res.ok) throw new Error("Failed to fetch user pets");
        const data = await res.json();
        setUserPets(data);
      } catch (error) {
        console.error("Error fetching user pets:", error);
      }
    };

    if (session?.user?.id) {
      fetchUserPets();
    }
  }, [session?.user?.id]);

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

      // Handle image upload
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
        body: formData, // Send FormData directly
      });

      if (!response.ok) {
        throw new Error(`Failed to create pet: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Pet created:", data);

      alert("Pet created successfully!");
      setNewPet({ name: "", image: "", description: "", age: "", breed: "" });
      location.reload(); // Refresh to show the new pet
    } catch (error) {
      console.error("Error creating pet:", error);
      alert("An error occurred while creating the pet.");
    } finally {
      setLoading(false);
    }
  };

  // Handle pet deletion
  const handleDeletePet = async (id: number) => {
    if (!confirm("Are you sure you want to delete this pet?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: "DELETE",
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
          alert("Pet deleted successfully!");
          // Update the userPets state by removing the deleted pet
          setUserPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
        } else {
          alert("Unexpected response format from the server.");
        }
      } else {
        alert(`Error: ${responseText || "Failed to delete pet"}`);
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
      alert("An error occurred while deleting the pet.");
    } finally {
      setLoading(false);
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
    setUserPets((prevPets) =>
      prevPets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
    );
    handleModalClose();
  };

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

  // Handle adoption request
  const handleAdopt = async (petId: number) => {
    if (!message) {
      alert("Please enter a message");
      return;
    }

    try {
      const res = await fetch("/api/adoptionRequests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId, userId: session?.user?.id, message }),
      });

      if (res.ok) {
        alert("Adoption request submitted!");
        setMessage("");
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || "Failed to submit request"}`);
      }
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      alert("An error occurred while submitting the request.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">My Pets</h2>

      {/* Create Pet Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add a New Pet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Pet Name"
            value={newPet.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="age"
            placeholder="Pet Age"
            value={newPet.age}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="breed"
            placeholder="Pet Breed"
            value={newPet.breed}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {newPet.image && (
          <div className="mt-4">
            <img src={newPet.image} alt="Preview" className="w-48 h-48 object-cover rounded-lg shadow-sm" />
          </div>
        )}
        <textarea
          name="description"
          placeholder="Description"
          value={newPet.description}
          onChange={handleChange}
          className="w-full p-2 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <button
          onClick={handleCreatePet}
          className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Creating..." : "Add Pet"}
        </button>
      </div>

      {/* Display User's Pets */}
      <PetList
        pets={userPets}
        isAdmin={true}
        handleDeletePet={handleDeletePet}
        handleEditPet={handleEditPet}
        session={session}
      />

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

export default MyPets;
