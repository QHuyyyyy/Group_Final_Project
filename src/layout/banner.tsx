import React from 'react';
import bubble from '../assets/bubble.png';
import background from '../assets/background.png';

interface BannerProps {
  title: string;
  description: string;
}

const Banner: React.FC<BannerProps> = ({ title}) => {
  return (
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
        <button className="mt-8 text-white px-8 py-3 bg-transparent border-2 border-white rounded-[30px] hover:bg-white/10 transition-all duration-300 text-lg font-medium">
          Explore
        </button>
      </div>

      {/* Bubbles */}
      <div className="bubbles w-full flex items-center justify-around absolute -bottom-[70px]">
        {[...Array(7)].map((_, i) => (
          <img 
            key={i}
            src={bubble}
            alt="Bubble"
            className={`w-[${i === 0 || i === 2 ? '25px' : i === 5 ? '20px' : i === 6 ? '35px' : '50px'}] animate-bubble`}
            style={{
              animationDelay: `${i === 0 ? '2s' : i === 1 ? '1s' : i === 2 ? '2s' : i === 3 ? '1.5s' : i === 4 ? '3s' : i === 5 ? '3,5s' : '3s'}`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
