import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from 'antd';

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
    <Layout className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center justify-center h-screen">
        {/* Logo Container */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={logoVariants}
          className="mb-4"
        >
          <div className="w-45 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-white">ClaimRequest</span>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-2xl font-semibold text-gray-700 mb-4"
        >
          Loading
        </motion.h2>

        {/* Animated Dots */}
        <motion.div
          variants={dotsVariants}
          animate="animate"
          className="flex gap-2 mb-5"
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
          className="text-gray-500 text-sm"
        >
          <p>Please wait while we prepare your experience</p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default UserSpinner;
  