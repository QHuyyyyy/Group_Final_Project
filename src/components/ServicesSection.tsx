import React, { useRef, useState, useEffect } from 'react';

const ServicesSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const services = [
    {
      title: "Cloud & Data",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80", 
    },
    {
      title: "Artificial Intelligence",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80",
    },
    {
      title: "Low-Code",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80",
    },
    {
      title: "Hyper Automation",
      image: "https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?q=80",
    },
    {
      title: "ERP Modernization",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80",
    },
    {
      title: "Digital Commerce & Experience",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80",
    },
    {
      title: "Legacy Modernization",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80",
    },
    {
      title: "Global Managed Services",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80",
    },
    {
      title: "Healthcare",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80",
    },
    {
      title: "BFSI",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80",
    }
  ];

  // Tạo mảng với 2 bản sao thay vì 3
  const extendedServices = [...services, ...services];

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAutoScrolling) {
      intervalId = setInterval(() => {
        handleNextSlide();
      }, 3000); // Tăng thời gian interval lên 3s
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentIndex, isAutoScrolling]);

  const handleNextSlide = () => {
    if (sliderRef.current) {
      const cardWidth = 416;
      const totalCards = services.length;
      
      setCurrentIndex(prev => {
        const nextIndex = prev + 1;
        
        if (nextIndex >= totalCards) {
          // Reset về đầu một cách mượt mà
          sliderRef.current!.style.transition = 'none';
          sliderRef.current!.style.transform = 'translateX(0)';
          
          // Force reflow
          sliderRef.current!.offsetHeight;
          
          // Bật lại transition
          sliderRef.current!.style.transition = 'transform 1s ease';
          return 0;
        }

        sliderRef.current!.style.transition = 'transform 1s ease';
        sliderRef.current!.style.transform = `translateX(-${cardWidth * nextIndex}px)`;
        return nextIndex;
      });
    }
  };

  return (
    <div className="w-full bg-white py-16 relative z-0">
      <div className="container mx-auto px-4">
        {/* Tiêu đề chính */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Harness Continuous{' '}
            <span className="text-green-500">Innovation</span>
            {' & '}
            <span className="text-orange-500">AI</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            In all of FPT Software's comprehensive service and solutions, AI is embedded as an accelerator to enable 
            new levels of performance for clients and enhance efficiency in our own operations.
          </p>
        </div>

        {/* Slider container */}
        <div 
          className="overflow-hidden relative mb-12"
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
        >
          <div 
            ref={sliderRef}
            className="flex gap-6"
            style={{
              transition: 'transform 1s ease',
              willChange: 'transform'
            }}
          >
            {extendedServices.map((service, index) => (
              <div 
                key={index}
                className="flex-none w-[400px]"
                style={{
                  transform: 'translateZ(0)', // Hardware acceleration
                }}
              >
                <div className="relative h-[500px] rounded-lg overflow-hidden group">
                  <img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    style={{
                      transition: 'transform 0.5s ease',
                      willChange: 'transform',
                      transform: 'translateZ(0)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-white text-3xl font-bold">{service.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nút mũi tên */}
        <div className="flex justify-end mb-8">
          <button 
            onClick={() => {
              setIsAutoScrolling(false);
              handleNextSlide();
              setTimeout(() => setIsAutoScrolling(true), 3000);
            }}
            className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-6 h-6 text-gray-800"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection; 