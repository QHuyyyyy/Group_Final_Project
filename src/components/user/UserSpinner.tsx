import React from 'react';
import { motion } from 'framer-motion';

const UserSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[5px] z-50">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute -inset-6 rounded-2xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.8) 0%, rgba(59,130,246,0) 70%)' }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Main logo container */}
        <div className="w-64 h-24 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-[0_0_25px_rgba(56,189,248,0.5)] flex items-center justify-center overflow-hidden relative">
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-200%', '200%'],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/80"
                initial={{
                  x: Math.random() * 100 - 50 + '%',
                  y: Math.random() * 100 - 50 + '%',
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  y: [null, Math.random() * -100 - 20 + '%'],
                  opacity: [0, 0.8, 0],
                  scale: [0, Math.random() * 0.8 + 0.2, 0]
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Logo text with animated underline */}
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              ClaimRequest
            </span>
            <motion.div
              className="h-0.5 bg-white/80 rounded-full mt-1"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{
                duration: 1.2,
                delay: 0.3,
                ease: "easeOut"
              }}
            />
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center mt-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 mx-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UserSpinner;
