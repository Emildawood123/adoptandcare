"use client";

import { useEffect, useState } from "react";

const MyOrders = ({ session }) => {
  const [orders, setOrders] = useState([]); // Initialize with an empty array

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/${session.user._id}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (session?.user?._id) {
      fetchOrders();
    }
  }, [session]);
  const handleCancelOrder = async (id: string) => {
  const confirmed = window.confirm("Are you sure you want to update the order status?");
  if (!confirmed) return;
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to cancel order");

      // Remove the canceled order from the state
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
      alert("Order canceled successfully!");
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <p>Order ID: {order._id}</p>
              <p>Status: {order.status}</p>
              <p>Total Amount: ${order.totalAmount}</p>
              {/* Cancel Button */}
              {order.status === "Pending" && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
