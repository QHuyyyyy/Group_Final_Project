import React from 'react';
import bubble from '../assets/bubble.png';
import background from '../assets/background.png';
import { motion } from 'framer-motion';

interface BannerProps {
  title: string;
  description: string;
}

const Banner: React.FC<BannerProps> = ({ title }) => {
  const scrollToNextSection = () => {
    const bannerSection = document.querySelector('.hero');
    if (bannerSection) {
      const bannerHeight = bannerSection.clientHeight;
      window.scrollTo({
        top: bannerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="hero relative h-screen w-full overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)'
          }}
        />

        {/* Content */}
        <div className="content absolute top-1/2 left-[8%] -translate-y-1/2 text-white z-10">
          <small className="text-lg font-light tracking-wider uppercase text-gray-300 mb-4 block">
            {title}
          </small>
          <h1 className="text-[80px] font-bold my-[10px] leading-[90px] tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-100 text-transparent bg-clip-text">
            For complex business <br /> challenges and <br /> opportunitie
          </h1>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToNextSection}
            className="mt-8 text-white px-8 py-3 bg-transparent border-2 border-white rounded-[30px] transition-all duration-300 text-lg font-medium relative overflow-hidden group"
          >
            <span className="relative z-10">Explore</span>
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-10"/>
          </motion.button>
        </div>

        {/* Bubbles */}
        <div className="bubbles w-full flex items-center justify-around absolute -bottom-[70px]">
          {[...Array(7)].map((_, i) => (
            <img 
              key={i}
              src={bubble}
              alt="Bubble"
              className="animate-bubble"
              style={{
                width: i === 0 || i === 2 ? '15px' : 
                       i === 5 ? '35px' : 
                       i === 6 ? '20px' : '70px',
                animationDelay: `${i === 0 ? '2s' : i === 1 ? '1s' : i === 2 ? '2s' : i === 3 ? '1.5s' : i === 4 ? '3s' : i === 5 ? '3.5s' : '5s'}`
              }}
            />
          ))}
        </div>
      </div>
      <div id="next-section"></div>
    </>
  );
};

export default Banner;
