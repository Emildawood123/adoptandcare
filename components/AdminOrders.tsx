"use client";

import { useEffect, useState } from "react";

const AdminOrders = ({ session }) => {
  const [orders, setOrders] = useState([]); // Initialize with an empty array

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/f");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update order status");

      // Update the order status in the state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  // Handle order deletion
  const handleDeleteOrder = async (id: number) => {
    if (!confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete order");

      // Remove the deleted order from the state
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Manage Orders</h2>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-600">User: {order.user.email}</p>
                  <p className="text-sm text-gray-600">Status: {order.status}</p>
                </div>
                <div className="mt-2 flex space-x-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="p-2 border rounded bg-gray-100"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm opacity-90 hover:opacity-100 transition"
                  >
                    ✖ Delete
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <ul className="list-disc list-inside">
                  {order.orderItems.map((orderItem) => (
                    <li key={orderItem.id} className="text-sm text-gray-600">
                      {orderItem.product.name} - {orderItem.quantity} x ${orderItem.product.price}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 mt-2">Total: ${order.totalAmount}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
