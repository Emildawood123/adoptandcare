import React, { useState, useEffect } from "react";

type Pet = {
  id: number;
  name: string;
  breed: string;
  age: number;
  location: string;
  image: string;
  description: string;
};

type EditPetModalProps = {
  isOpen: boolean;
  pet: Pet | null;
  onClose: () => void;
  onConfirm: (updatedPet: Pet) => void;
};

const EditPetModal: React.FC<EditPetModalProps> = ({ isOpen, pet, onClose, onConfirm }) => {
  const [updatedPet, setUpdatedPet] = useState<Pet | null>(pet);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUpdatedPet(pet);
  }, [pet]);

  if (!isOpen || !updatedPet) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUpdatedPet({ ...updatedPet, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pets/${updatedPet.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPet),
      });

      if (!response.ok) {
        throw new Error("Failed to update pet");
      }

      const data = await response.json();
        onConfirm(data);
        location.reload()
    } catch (error) {
      console.error("Error updating pet:", error);
      alert("An error occurred while updating the pet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Pet</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={updatedPet.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={updatedPet.age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Breed</label>
            <input
              type="text"
              name="breed"
              value={updatedPet.breed}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={updatedPet.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPetModal;
