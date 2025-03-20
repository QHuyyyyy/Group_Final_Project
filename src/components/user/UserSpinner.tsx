import React from 'react';
import { motion } from 'framer-motion';


const UserSpinner: React.FC = () => {
  const logoVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const textVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.5
      }
    }
  };

  const dotsVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const dotVariants = {
    animate: {
      y: ["0%", "-50%", "0%"],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        {/* Logo Container */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={logoVariants}
          className="mb-4"
        >
          <div className="w-full h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg flex items-center justify-center px-6">
            <span className="text-xl font-bold text-white">ClaimRequest</span>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-2xl font-semibold text-gray-700 mb-4 text-center"
        >
          Loading
        </motion.h2>

        {/* Animated Dots */}
        <motion.div
          variants={dotsVariants}
          animate="animate"
          className="flex gap-2 justify-center mb-5"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              variants={dotVariants}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
            />
          ))}
        </motion.div>

        {/* Loading Message */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-gray-500 text-sm text-center"
        >
          <p>Please wait while we process your request</p>
        </motion.div>
      </div>
    </div>
  );
};

export default UserSpinner;
  