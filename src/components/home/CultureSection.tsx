import React from 'react';

const CultureSection: React.FC = () => {
  const cultureCards = [
    {
      title: "Thriving On Happiness",
      image: "https://bcp.cdnchinhphu.vn/334894974524682240/2023/1/4/dai-dien-tai-fpt-software-nhat-ban-chao-don-chi-watanabe-hirona-ky-su-he-thong-thu-ba-tu-phai-qua-16727987339341631106739.jpg",
      color: "bg-blue-600"
    },
    {
      title: "Learning & Innovation",
      image: "https://vcdn1-kinhdoanh.vnecdn.net/2022/07/27/6g9a0577-jpg-1658905713-1882-1658905814.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=tJrRLV5axzvHmClFhmL0mw",
      color: "bg-green-500"
    },
    {
      title: "Culture Of Celebration",
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2022-03/1_96157.jpg.jpg",
      color: "bg-orange-500"
    },
    {
      title: "Diversity & Inclusion",
      image: "https://cms.thainguyen.vn/documents/11304592/17097194/dvt00019-3907.jpg.webp/edfaee14-0ccf-454d-9cf5-a792135b88b4",
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