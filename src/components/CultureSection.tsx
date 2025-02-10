import React from 'react';

const CultureSection: React.FC = () => {
  const cultureCards = [
    {
      title: "Thriving On Happiness",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80",
      color: "bg-blue-600"
    },
    {
      title: "Learning & Innovation",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80",
      color: "bg-green-500"
    },
    {
      title: "Culture Of Celebration",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80",
      color: "bg-orange-500"
    },
    {
      title: "Diversity & Inclusion",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80",
      color: "bg-cyan-500"
    }
  ];

  return (
    <div className="w-full bg-white py-16 relative z-0">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Beyond <span className="text-green-500">An</span>{' '}
            <span className="text-green-700">Em</span>
            <span className="text-orange-500">ployer</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Building an inclusive, future-ready and happy workforce, while allowing our team to thrive on challenging
            missions and benefit from the latest in technologies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cultureCards.map((card, index) => (
            <div 
              key={index}
              className="relative overflow-hidden rounded-lg group cursor-pointer"
            >
              <div className="aspect-[3/4]">
                <img 
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 opacity-60 ${card.color} mix-blend-multiply`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold">{card.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CultureSection; 