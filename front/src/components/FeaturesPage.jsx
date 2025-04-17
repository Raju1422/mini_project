import React from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaShieldAlt,
  FaBell,
  FaRoute,
} from "react-icons/fa";
import { MdOutlineFeedback, MdOutlineLiveTv } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaMapLocationDot } from "react-icons/fa6";

const Features = [
  {
    title: "Live Tracking",
    description: "Track your loved ones in real-time and ensure their safety.",
    icon: <FaMapLocationDot className="text-pink-600 text-4xl" />,
    url: "live-track",
  },
  {
    title: "Prior Risk Analysis",
    description: "Analyze risks along your route and plan safer journeys.",
    icon: <FaRoute className="text-pink-600 text-4xl" />,
    url: "path-analysis",
  },
  {
    title: "Safety Premise Suggestions",
    description:
      "Get recommendations for safe premises based on community inputs.",
    icon: <FaShieldAlt className="text-pink-600 text-4xl" />,
    url: "safe-places",
  },
  {
    title: "High-Risk Area Identification",
    description: "Identify high-risk areas and avoid them during your travels.",
    icon: <FaMapMarkerAlt className="text-pink-600 text-4xl" />,
    url: "risk-areas",
  },

  {
    title: "User Interaction and Feedback",
    description:
      "Share your experiences and provide feedback to help others stay safe.",
    icon: <MdOutlineFeedback className="text-pink-600 text-4xl" />,
    url: "feedback",
  },
  {
    title: "Community Sharing",
    description:
      "Connect with the community to share safety tips and real-time updates.",
    icon: <FaUsers className="text-pink-600 text-4xl" />,
    url: "report",
  },
  {
    title: "Alert and Notifications",
    description: "Receive instant alerts and notifications about nearby risks.",
    icon: <FaBell className="text-pink-600 text-4xl" />,
    url: "notifications",
  },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full bg-white p-4 shadow-md text-center">
        <h1 className="text-3xl font-bold text-pink-600">Our Features</h1>
        <p className="text-gray-600 mt-2">
          Making your journeys safer, together.
        </p>
      </header>

      {/* Features Section */}
      <section className="container mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Features.map((feature, index) => (
          <Link to={`/${feature.url}`}>
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </motion.div>
          </Link>
        ))}
      </section>

      {/* Call to Action */}
      <motion.div
        className="mt-12 bg-pink-500 text-white py-4 px-8 rounded-lg shadow-lg hover:shadow-xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <h2 className="text-xl font-bold">Start Your Safer Journey Today!</h2>
        <p className="mt-2">
          Join our community and make safety your priority.
        </p>
      </motion.div>
    </div>
  );
};

export default FeaturesPage;
