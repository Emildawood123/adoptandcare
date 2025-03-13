import { useEffect, useState } from "react";

const EditProductModal = ({ isOpen, product, onClose, onConfirm }) => {
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "", // Assuming you want to handle image uploads separately
    quantity: 1, // Add quantity field
  });

  // Initialize the form with the product data when the modal opens
  useEffect(() => {
    if (product) {
      setUpdatedProduct({
        name: product.name,
        price: product.price,
        description: product.description || "",
        image: product.image || "", // Assuming the image is stored as a URL
        quantity: product.quantity || 1, // Initialize quantity
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUpdatedProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: updatedProduct.name,
          price: parseFloat(updatedProduct.price), // Ensure price is a float
          description: updatedProduct.description,
          image: updatedProduct.image, // Include the image URL
          quantity: parseInt(updatedProduct.quantity), // Ensure quantity is an integer
        }),
      });

      if (response.ok) {
        alert("Product updated successfully!");
        onConfirm(updatedProduct); // Refresh the product list
        onClose(); // Close the modal
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to update product"}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    }
  };

  const handleCancel = () => {
    onClose(); // Close the modal without saving
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full transform transition-all scale-100 hover:scale-105">
        <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>

        {/* Name Input */}
        <input
          type="text"
          name="name"
          value={updatedProduct.name}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Product Name"
        />

        {/* Price Input */}
        <input
          type="number"
          name="price"
          value={updatedProduct.price}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Price"
          step="0.01" // Allow decimal values for price
        />

        {/* Quantity Input */}
        <input
          type="number"
          name="quantity"
          value={updatedProduct.quantity}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Quantity"
          min="0" // Ensure quantity is non-negative
        />

        {/* Description Input */}
        <textarea
          name="description"
          value={updatedProduct.description}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Description"
        />

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Image Preview */}
        {updatedProduct.image && (
          <img
            src={updatedProduct.image}
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
  );
};

export default EditProductModal;
