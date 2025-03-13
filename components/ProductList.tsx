"use client";

import { useEffect, useState } from "react";
import EditProductModal from "@/components/editProductModal"; // Assuming you have a modal for editing products

type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
  quantity: number;
  price: number;
};

const ProductSection = ({ session, isAdmin }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle order placement
  const handleAddToCart = async (productId: number) => {
    const quantity = quantities[productId] || 1;

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?._id, productId, quantity }),
      });

      if (!res.ok) {
        throw new Error("Failed to add item to cart");
      }

      alert("Item added to cart!");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("An error occurred while adding the item to the cart.");
    }
  };
const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities((prevQuantities) => ({ ...prevQuantities, [productId]: quantity }));
  };
  // Handle product creation
  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image || newProduct.quantity === undefined) {
      alert("Name, price, image, and quantity are required!");
      return;
    }

    // Log the newProduct object to ensure it is correctly formed
    console.log("Creating product with data:", newProduct);

    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price), // Ensure price is a float
          quantity: parseInt(newProduct.quantity), // Ensure quantity is an integer
        }),
      });

      // Check if the response is OK
      if (response.ok) {
        // Parse JSON only if the response is OK and has JSON content
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          alert("Product created successfully!");
          setNewProduct({ name: "", price: "", description: "", image: "", quantity: 1 });
          location.reload(); // Refresh to show the new product
        } else {
          alert("Unexpected response format from the server.");
        }
      } else {
        // Handle non-JSON error responses
        const errorText = await response.text();
        alert(`Error: ${errorText || "Failed to create product"}`);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("An error occurred while creating the product.");
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Product deleted successfully!");
        setProducts(products.filter((product) => product.id !== productId));
      } else {
        const errorText = await response.text();
        alert(`Error: ${errorText || "Failed to delete product"}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    } finally {
      setLoading(false);
    }
  };

  // Handle product editing
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle modal confirm (after editing)
  const handleModalConfirm = () => {
    handleModalClose();
    location.reload(); // Refresh to show updated product details
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setNewProduct((prev) => ({ ...prev, image: reader.result as string }));
    };
  };

  if (isAdmin) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Products</h2>

        {/* Create Product Form */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Add a New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newProduct.price}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={newProduct.quantity}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {newProduct.image && (
            <div className="mt-4">
              <img src={newProduct.image} alt="Preview" className="w-48 h-48 object-cover rounded-lg shadow-sm" />
            </div>
          )}
          <textarea
            name="description"
            placeholder="Description"
            value={newProduct.description}
            onChange={handleChange}
            className="w-full p-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            onClick={handleCreateProduct}
            className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Creating..." : "Add Product"}
          </button>
        </div>

        {/* Display Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs opacity-90 hover:opacity-100 transition"
                  >
                    ✖
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                  <p className="text-sm text-gray-600 mt-1">{product.quantity}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">${product.price}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No products available. Add some! 🛍️</p>
            </div>
          )}
        </div>

        {/* Edit Product Modal */}
        <EditProductModal
          isOpen={isModalOpen}
          product={selectedProduct}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
        />
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <p className="text-sm text-gray-600 mt-1">{product.quantity}</p>
              <p className="text-lg font-bold text-blue-600 mt-2">${product.price}</p>
              <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                  className="w-16 p-2 border rounded-md"
                />
              <button
                onClick={() => handleAddToCart(product.id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Add to cart
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 text-lg">No products available. Add some! 🛍️</p>
          </div>
        )}
      </div>
    );
  }
};

export default ProductSection;
