import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
};

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await fetch(`/api/cart?id=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch cart items");
        }
        const data = await res.json();
        setCartItems(data);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleRemoveFromCart = async (cartItemId: number) => {
    const confirm = window.confirm("Are you sure you want to delete this?");
    if (!confirm) return;
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cartItemId }),
      });

      if (!res.ok) {
        throw new Error("Failed to remove item from cart");
      }

      setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const handleMakeOrder = async () => {
    console.log(userId, cartItems)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cartItems }),
      });

      if (!res.ok) {
        throw new Error("Failed to make order");
      }

      alert("Order placed successfully!");
      setCartItems([]); // Clear the cart after placing the order
    } catch (error) {
      console.error("Failed to make order:", error);
      alert("An error occurred while placing the order.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <h3 className="text-lg font-bold">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">Price: ${item.product.price}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-600">Total: ${item.product.price * item.quantity}</p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleMakeOrder}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
            >
              Make Order
            </button>
          </>
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
