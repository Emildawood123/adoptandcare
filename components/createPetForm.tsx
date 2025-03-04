import { useState } from "react";
import { ReactNode } from "react";
// ...


const CreatePetForm = ({ newPet, handleChange, handleImageUpload, handleCreatePet, loading, children }) => {
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag and drop for image upload
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  return (
   <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Pets</h2>
      
      {/* Pet Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter pet name"
          value={newPet.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Pet Age and Breed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input
            type="number"
            name="age"
            placeholder="Enter pet age"
            value={newPet.age}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
          <input
            type="text"
            name="breed"
            placeholder="Enter pet breed"
            value={newPet.breed}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pet Image</label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full p-6 border-2 border-dashed ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
          } rounded-lg text-center cursor-pointer transition-all`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            {newPet.image ? (
              <img
                src={newPet.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md mb-2"
              />
            ) : (
              <div>
                <p className="text-gray-500">
                  Drag & drop an image or{" "}
                  <span className="text-blue-600 hover:text-blue-500">click to upload</span>
                </p>
                <p className="text-sm text-gray-400 mt-1">(JPEG, PNG, or WEBP)</p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Enter a description for your pet"
          value={newPet.description}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleCreatePet}
        className="w-full mb-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span className="ml-2">Creating...</span>
          </div>
        ) : (
          "Create Pet"
        )}
      </button>
      { children}
    </div>
  );
};

export default CreatePetForm;
