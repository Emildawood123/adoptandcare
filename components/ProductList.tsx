import { useEffect, useState } from "react";
import EditProductModal from "@/components/editProductModal"; // Assuming you have a modal for editing products

type Product = {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
};

const ProductSection = ({ session, isAdmin }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", image: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  const handlePlaceOrder = async (productId: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: 1 }), // Default quantity is 1
      });

      if (response.ok) {
        alert("Order placed successfully!");
        // Redirect to the "My Orders" page or refresh the product list
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to place order"}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };
  // Handle product creation
  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      alert("Name, image, and price are required!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);

    const fileBlob = await fetch(newProduct.image)
      .then((res) => res.blob())
      .catch((error) => console.error("Error fetching image:", error));

    if (fileBlob) {
      formData.append("file", fileBlob);
    }

    const response = await fetch("/api/products", { method: "POST", body: formData });

    if (response.ok) {
      alert("Product created successfully!");
      setNewProduct({ name: "", image: "", description: "", price: "" });
      location.reload(); // Refresh to show the new product
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || "Failed to create product"}`);
    }
    setLoading(false);
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });

    if (response.ok) {
      alert("Product deleted successfully!");
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || "Failed to delete product"}`);
    }
  };

  // Handle product editing
  const handleEditProduct = (productId: string) => {
    setSelectedProduct(productId);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
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
                key={product._id}
                className="bg-white p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs opacity-90 hover:opacity-100 transition"
                  >
                    ✖
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">${product.price}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => handleEditProduct(product._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>

                  </div>
                  /</div>
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
                key={product._id}
                className="bg-white p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
              >
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">${product.price}</p>
                <button
          onClick={() => handlePlaceOrder(product._id)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Order Now
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
