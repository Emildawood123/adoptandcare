import { useEffect, useState } from "react";

const EditPetModal = ({ isOpen, pet, onClose, onConfirm }) => {
  if (!pet) return null; // If no pet is selected, render nothing or a loading state

  const [updatedPet, setUpdatedPet] = useState(pet || {
  name: "",
  description: "",
  age: "",
  breed: "",
  image: "",
});
console.log(updatedPet)
useEffect(() => {
    if (updatedPet) {
      setUpdatedPet(updatedPet);
    }
  }, [updatedPet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPet({ ...updatedPet, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUpdatedPet((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };


  const handleSubmit = async () => {
    // Handle the update logic, such as sending the updated pet data to the server
    const response = await fetch(`/api/pets/${pet}`, {
      method: "PUT",
      body: JSON.stringify(updatedPet),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Pet updated successfully!");
      onConfirm(updatedPet);  // Close the modal and refresh state
    } else {
      alert("Error updating pet");
    }
  };

  const handleCancel = () => {
    onClose();  // This will close the modal by setting isModalOpen to false
  };

  return (
     <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full transform transition-all scale-100 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4">Edit Pet</h2>

            {/* Name Input */}
            <input
              type="text"
              name="name"
              value={updatedPet.name}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Pet Name"
            />

            {/* Description Input */}
            <textarea
              name="description"
              value={updatedPet.description}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
            />

            {/* Age Input */}
            <input
              type="number"
              name="age"
              value={updatedPet.age}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Age"
            />

            {/* Breed Input */}
            <input
              type="text"
              name="breed"
              value={updatedPet.breed}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Breed"
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
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>

  );
};
export default EditPetModal;
