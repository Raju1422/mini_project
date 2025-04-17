import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Prime = () => {
  const navigate = useNavigate(); // For navigation after logout

  // Navigate to Login page
  const handleLogin = () => {
    navigate("/login");
  };

  // Navigate to Signup page
  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 via-purple-200 to-pink-100 min-h-screen flex items-center justify-center">
      {/* Glassmorphism Container */}
      <div className="relative flex items-center justify-center w-full max-w-4xl h-96 bg-white/30 rounded-2xl shadow-2xl backdrop-blur-lg p-8">
        {/* Overlay for Glassmorphism */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-300 to-pink-300 opacity-40 rounded-2xl"
        ></motion.div>

        {/* Content */}
        <div className="text-center relative z-10 text-white">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold"
          >
            Women Safe Travel
          </motion.h1>
          <p className="mt-4 text-lg md:text-xl font-semibold text-white/90">
            Empowering women with real-time safety tracking while traveling
          </p>

          <div className="mt-8 flex justify-center gap-6">
            <motion.button
              onClick={handleLogin}
              whileHover={{ scale: 1.1 }}
              className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-lg hover:bg-pink-700 transition-all duration-300"
            >
              Login
            </motion.button>

            <motion.button
              onClick={handleSignup}
              whileHover={{ scale: 1.1 }}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
            >
              Sign Up
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prime;
