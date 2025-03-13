"use client";

import { useEffect, useState } from "react";

type AdoptionRequest = {
  id: number; // Changed from _id to id for PostgreSQL
  pet: { name: string; image: string };
  user: { name: string; email: string };
  message: string;
  status: string;
};

const AdminAdoptionRequests = () => {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);

  // Fetch adoption requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/adoptionRequests");
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch adoption requests:", error);
      }
    };

    fetchRequests();
  }, []);

  // Handle status update (approve or reject)
  const handleStatusUpdate = async (requestId: number, status: string) => {
    try {
      const res = await fetch("/api/adoptionRequests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });

      if (res.ok) {
        location.reload()
        // Update the local state with the updated request
        const updatedRequest = await res.json();
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === updatedRequest.id ? updatedRequest : request
          )
        );
        alert(`Request ${status.toLowerCase()} successfully!`);
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || "Failed to update request"}`);
      }
    } catch (error) {
      alert("An error occurred while updating the request.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Adoption Requests</h2>
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id} // Changed from _id to id
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <img
                src={request.pet.image}
                alt={request.pet.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <h3 className="text-lg font-bold">{request.pet.name}</h3>
                <p className="text-sm text-gray-600">
                  Requested by: {request.user.name} ({request.user.email})
                </p>
                <p className="text-sm text-gray-600">
                  Message: {request.message}
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      request.status === "Approved"
                        ? "text-green-600"
                        : request.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {request.status}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleStatusUpdate(request.id, "Approved")}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Approved
              </button>
              <button
                onClick={() => handleStatusUpdate(request.id, "Rejected")}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAdoptionRequests;
