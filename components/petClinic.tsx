import React from "react";

export const PetClinic = ({ userId }) => {
  const handleBookAppointment = async () => {
    try {

      const requestedDate = new Date().toISOString(); // Replace with the actual requested date

      const res = await fetch("/api/vet-consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, requestedDate }),
      });

      if (!res.ok) throw new Error("Failed to create vet consultation request");

      const data = await res.json();
      alert("we will contact with you as soon as possible! check your phone open!");
    } catch (error) {
      console.error("Error creating vet consultation request:", error);
      alert("Failed to create vet consultation request. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome to Our Pet Clinic</h1>
      <div className="space-y-4">
        <section>
          <h2 className="text-2xl font-semibold text-gray-700">About Us</h2>
          <p className="text-gray-600 mt-2">
            Our pet clinic is dedicated to providing the best care for your furry friends. We offer a wide range of
            services to ensure your pets are healthy and happy. Our team of experienced veterinarians and staff are
            passionate about animal care and are here to help with all your pet's needs.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-700">Services</h2>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li>General Check-ups</li>
            <li>Vaccinations</li>
            <li>Dental Care</li>
            <li>Surgery</li>
            <li>Emergency Services</li>
            <li>Pet Grooming</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-700">Contact Us</h2>
          <p className="text-gray-600 mt-2">
            Address: 123 Pet Street, Animal City, PA 12345
            <br />
            Phone: (123) 456-7890
            <br />
            Email: info@petclinic.com
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-700">Opening Hours</h2>
          <p className="text-gray-600 mt-2">
            Monday - Friday: 9:00 AM - 6:00 PM
            <br />
            Saturday: 10:00 AM - 4:00 PM
            <br />
            Sunday: Closed
          </p>
        </section>
        <div className="text-center mt-6">
          <button
            onClick={handleBookAppointment}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            vet consultation request
          </button>
        </div>
      </div>
    </div>
  );
};
