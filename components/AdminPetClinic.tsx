import { getUserById } from "@/lib/db";
  import { get } from "http";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AdminPetClinic = ({ session }) => {
  const [vetConsultations, setVetConsultations] = useState([]); // Initialize with an empty array

  // Fetch vet consultation requests on component mount

  useEffect(() => {
    const fetchVetConsultations = async () => {
      try {
        const res = await fetch(`/api/vet-consultations?userId=${session?.user?._id}`);
        if (!res.ok) throw new Error("Failed to fetch vet consultation requests");
        const data = await res.json();
        setVetConsultations(data);
        

      } catch (error) {
        console.error("Error fetching vet consultation requests:", error);
      }
    };

    if (session?.user?._id) {
      fetchVetConsultations();
    }
  }, [session?.user?._id]);

  // Handle status update
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/vet-consultations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update vet consultation status");

      // Update the vet consultation status in the state
      setVetConsultations((prevVetConsultations) =>
        prevVetConsultations.map((vetConsultation) =>
          vetConsultation.id === id ? { ...vetConsultation, status: newStatus } : vetConsultation
        )
      );
      toast.success("Vet consultation status updated successfully!");
    } catch (error) {
      console.error("Error updating vet consultation status:", error);
      toast.error("Failed to update vet consultation status. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Manage Vet Consultations</h2>
      <div className="space-y-4">
        {vetConsultations.length > 0 ? (
          vetConsultations.map( (vetConsultation) => {
            return (

              <div key={vetConsultation.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">Consultation ID: {vetConsultation.id}</p>
                    <p className="text-sm text-gray-600">User: {vetConsultation.user.email}</p>
                    <p className="text-sm text-gray-600">User Phone Number: {vetConsultation.user.phone}</p>
                    <p className="text-sm text-gray-600">Status: {vetConsultation.status}</p>
                    <p className="text-sm text-gray-600">Requested Date: {new Date(vetConsultation.requestedDate).toLocaleString()}</p>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <select
                      value={vetConsultation.status}
                      onChange={(e) => handleStatusUpdate(vetConsultation.id, e.target.value)}
                      className="p-2 border rounded bg-gray-100"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No vet consultation requests found.</p>
        )}
      </div>
    </div>
  );
};
