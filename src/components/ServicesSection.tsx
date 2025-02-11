import React, { useRef, useState, useEffect } from 'react';

const ServicesSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const services = [
    {
      title: "Cloud & Big Data",
      image: "https://fptsoftware.com/-/media/project/fpt-software/fso/services/cloud/header-banner-desktop.webp?iar=0&extension=webp&modified=20231002171705&hash=7BC2B1A024FBDBBE8AD6F8B1F347D9EF", 
    },
    {
      title: "Artificial Intelligence",
      image: "https://itchronicles.com/wp-content/uploads/2020/11/where-is-ai-used.jpg",
    },
    {
      title: "Low-Code",
      image: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2024_2_16_638437150397689400_low-code.png",
    },
    {
      title: "Hyper Automation",
      image: "https://fptsoftware.com/-/media/project/fpt-software/fso/services/banner/hyperautomation-background.webp?iar=0&extension=webp&modified=20240520094755&hash=436507CD30B6CB0FD58C18E70299EE6F",
    },
    {
      title: "ERP Modernization",
      image: "https://media.licdn.com/dms/image/v2/D5612AQEheTkQrxEs3Q/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1687019563148?e=2147483647&v=beta&t=xe-DMr88HZw4hC0nbNahTPq3vp04xs-F9Ye7XXJbHUg",
    },
    {
      title: "Digital Commerce & Experience",
      image: "https://ecommercenews.com.au/uploads/story/2021/04/20/GettyImages-1206800961.webp",
    },
    {
      title: "Legacy Modernization",
      image: "https://amzur.com/wp-content/uploads/2022/11/Successful-Approaches-For-Legacy-Application-Modernization-_Amzur.jpg",
    },
    {
      title: "Global Managed Services",
      image: "https://www.globalts.com/images/easyblog_shared/July_2023/07-19-23/managedServices_602834521_400.jpg",
    },
    {
      title: "Healthcare",
      image: "https://alsahlgroup.com/wp-content/uploads/2025/01/0379_638260706292671006.jpg",
    },
    {
      title: "BFSI",
      image: "https://img-cdn.thepublive.com/fit-in/1200x675/filters:format(webp)/socialsamosa/media/media_files/dmA116YlDIuKyPDerbqw.png",
    }
  ];

  // Tạo mảng với 2 bản sao thay vì 3
  const extendedServices = [...services, ...services];

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAutoScrolling) {
      intervalId = setInterval(() => {
        handleNextSlide();
      }, 2000); // Tăng thời gian interval lên 3s
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