import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 shadow-md">
        <div className="text-xl font-bold text-pink-600">SHE SECURE</div>
      </header>

      <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl text-gray-800 font-semibold mb-4">About Us</h2>
        <p className="text-lg text-gray-700 mb-4">
          SHESECURE is a safety and security application designed to provide
          real-time location tracking and risk level predictions to ensure the
          safety of women. Using GPS technology and risk prediction models, we
          aim to provide users with crucial information about their
          surroundings.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Our application allows users to track their location and view nearby
          areas with varying levels of risk. If a user enters a high-risk area,
          an alert will be sent to inform them of potential danger.
        </p>
        <h3 className="text-2xl text-gray-800 font-semibold mb-4">
          Our Mission
        </h3>
        <p className="text-lg text-gray-700">
          Our mission is to empower women by giving them the tools to stay
          informed and safe. We strive to create a community where women can
          feel secure and confident when traveling in their daily lives.
        </p>
      </div>

      <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl text-gray-800 font-semibold mb-4">
          Contact Us
        </h3>
        <p className="text-lg text-gray-700">
          If you have any questions or feedback, feel free to reach out to us
          at:
        </p>
        <p className="text-lg text-blue-500">contact@womentracker.com</p>
      </div>
    </div>
  );
};

export default About;
