"use client";

import { useEffect, useState } from "react";

const MyOrders = ({ session }) => {
  const [orders, setOrders] = useState([]); // Initialize with an empty array

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log(`Fetching orders for user ID: ${session.user._id}`); // Debugging log
        const res = await fetch(`/api/orders?userId=${session.user._id}`);
        console.log(res)
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        console.log(`Fetched orders: ${JSON.stringify(data)}`); // Debugging log
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
      fetchOrders();
  }, [session?.user?._id]);
 const handleCancelOrder = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to cancel order");

      // Remove the canceled order from the state
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
      alert("Order canceled successfully!");
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };
console.log(orders)
  return (
   <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
              <p>Order ID: {order.id}</p>
              <p>Status: {order.status}</p>
              <p>Total Amount: ${order.totalAmount}</p>
              {/* Display Order Products */}
              <div className="mt-2">
                <h3 className="font-semibold">Products:</h3>
                {order.orderItems.map((orderItem) => (
                  <div key={orderItem.id} className="ml-4">
                    <p>{orderItem.product.name} (x{orderItem.quantity})</p>
                  </div>
                ))}
              </div>
              {/* Cancel Button */}
              {order.status === "Pending" && (
                <button
                  onClick={() => handleCancelOrder(order.id)}
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
