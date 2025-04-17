import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaBell, FaUsers, FaShieldAlt } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import { SHE } from "./../components/SHE.png";

const HomePage = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: "Live Location Tracking",
      icon: <FaMapMarkerAlt className="text-4xl text-pink-500" />,
      details:
        "Track real-time locations to ensure the safety of loved ones and receive live updates.",
    },
    {
      id: 2,
      title: "Emergency Alerts",
      icon: <FaBell className="text-4xl text-blue-500" />,
      details:
        "Send and receive emergency alerts to notify trusted contacts instantly.",
    },
    {
      id: 3,
      title: "Community Sharing",
      icon: <FaUsers className="text-4xl text-green-500" />,
      details:
        "Join a supportive community to share safety tips and nearby risks.",
    },
    {
      id: 4,
      title: "User Interaction and Feedback",
      icon: <IoMdWarning className="text-4xl text-yellow-500" />,
      details:
        "Provide feedback and interact with others to enhance your safety experience.",
    },
    {
      id: 5,
      title: "Safety Premises Suggestions",
      icon: <FaShieldAlt className="text-4xl text-red-500" />,
      details:
        "Get suggestions for nearby safe locations like police stations and hospitals.",
    },
    {
      id: 6,
      title: "High-Risk Area Identification",
      icon: <IoMdWarning className="text-4xl text-red-600" />,
      details:
        "Identify high-risk areas along your travel route and get alerts for safety.",
    },
  ];

  const handleLogout = () => {
    const check = window.confirm("Do you want to Logout?");
    if (check) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("username");


      sessionStorage.removeItem("username");
      navigate("/login");
    }
  };

  const handleReport = () => {
    navigate("/incident-report");
  };

  const handleStartTravel = () => {
    navigate("/start-travel");
  };

  return (
    <div className="bg-gradient-to-b from-white via-gray-100 to-gray-200 text-gray-800 min-h-screen">
      {/* Header */}
      <header className="p-4 shadow-md bg-white bg-opacity-40 backdrop-blur-lg rounded-md">
        <nav className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-pink-600"
          >
            <h1> SHE SECURE</h1>
          </motion.div>
          <ul className="flex space-x-6 text-sm">
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="/features" className="hover:text-pink-500">
                Features
              </a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="/about" className="hover:text-pink-500">
                About
              </a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#contact" className="hover:text-pink-500">
                Contact
              </a>
            </motion.li>
            <button
              onClick={handleLogout}
              className="bg-red-600 rounded-md p-3 text-white hover:bg-red-900"
            >
              Logout
            </button>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-white text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
            Empowering Safety <br />
            <span className="text-pink-500">One Step at a Time</span>
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Real-time tracking, alerts, and safety tips for women everywhere.
          </p>
          <motion.a
            whileHover={{ scale: 1.1 }}
            href="/features"
            className="inline-block mt-8 px-6 py-3 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600"
          >
            <Link to="/features">Explore Features</Link>
          </motion.a>
        </motion.div>
      </section>

      {/* Image Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Image Container */}
          <div className="w-full md:w-1/2 h-96 flex justify-center items-center">
            <img
              src="/SHE.png"
              alt="Safe Journey"
              className="w-80  rounded-lg"
            />
          </div>

          {/* Call to Action Container */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Plan Your Safe Journey
            </h2>
            <p className="text-gray-600 mb-6 text-center md:text-left">
              Start your travel with confidence. Explore safe routes and ensure
              a secure journey with real-time insights.
            </p>
            <button
              onClick={handleStartTravel}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
            >
              Start Travel
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                className="group relative w-full h-60 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative w-full h-full bg-white rounded-lg p-6 flex flex-col items-center justify-center">
                  {feature.icon}
                  <h3 className="mt-4 text-lg font-semibold text-gray-700">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-center">
                    {feature.details}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-200 text-gray-600">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 WomenTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
