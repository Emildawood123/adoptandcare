import { useEffect, useState } from "react";
import EditPetModal from "@/components/editModel";

type Pet = {
  _id: string;
  name: string;
  image: string;
  age: number;
  breed: string;
  description?: string;
};

const MyPets = ({ session }) => {
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState("");
  const [newPet, setNewPet] = useState({ name: "", image: "", description: "", age: "", breed: "" });
  const [loading, setLoading] = useState(false);

  // Fetch user's pets
  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const res = await fetch(`/api/pets/${session?.user?._id}`);
        if (!res.ok) throw new Error("Failed to fetch user pets");
        const data = await res.json();
        setUserPets(data);
      } catch (error) {
        console.error("Error fetching user pets:", error);
      }
    };

    if (session?.user?._id) {
      fetchUserPets();
    }
  }, [session?.user?._id]);

  // Handle pet creation
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
      location.reload(); // Refresh to show the new pet
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || "Failed to create pet"}`);
    }
    setLoading(false);
  };

  // Handle pet deletion
  const handleDeletePet = async (petId: string) => {
    const response = await fetch(`/api/pets/${petId}/${session?.user?._id}`, { method: "DELETE" });

    if (response.ok) {
      alert("Pet deleted successfully!");
      setUserPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || "Failed to delete pet"}`);
    }
  };

  // Handle pet editing
  const handleEditPet = (petId: string) => {
    setSelectedPet(petId);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle modal confirm (after editing)
  const handleModalConfirm = () => {
    handleModalClose();
    location.reload(); // Refresh to show updated pet details
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {userPets.length > 0 ? (
          userPets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
            >
              <div className="relative">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={() => handleDeletePet(pet._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs opacity-90 hover:opacity-100 transition"
                >
                  ✖
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-800">{pet.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{pet.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handleEditPet(pet._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <span className="text-sm text-gray-500">{pet.age} years old</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 text-lg">You have no pets yet! 🐾</p>
          </div>
        )}
      </div>

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
