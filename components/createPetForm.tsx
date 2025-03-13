"use client";

import { useState } from "react";

const CreatePetForm = ({
  newPet,
  handleChange,
  handleImageUpload,
  handleCreatePet,
  loading,
  children, // Add children prop
}) => {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Add a New Pet</h2>

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
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {newPet.image && (
          <div className="mt-4">
            <img src={newPet.image} alt="Preview" className="w-48 h-48 object-cover rounded-lg shadow-sm" />
          </div>
        )}
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
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Pet"}
      </button>

      {/* Render children */}
      {children}
    </div>
  );
};

export default CreatePetForm;
