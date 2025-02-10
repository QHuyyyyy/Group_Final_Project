import React from 'react';

const Banner: React.FC = () => {
  return (
    <div className="relative h-[calc(100vh-64px)] mt-16">
      {/* Ảnh nền */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5)'
        }}
      />
      
      {/* Nội dung banner */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            We Are A Comprehensive
            <br />
            Technology Enabler
          </h1>
          <p className="text-xl md:text-2xl">
            For complex business challenges and opportunities
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
