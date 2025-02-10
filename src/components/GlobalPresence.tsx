import React from 'react';

const GlobalPresence: React.FC = () => {
  const stats = [
    {
      number: "86",
      title: "Branches",
      subtitle: "& Representative offices",
      textColor: "text-blue-500"
    },
    {
      number: "33,000+",
      title: "Employees",
      subtitle: "",
      textColor: "text-blue-700"
    },
    {
      number: "1,100+",
      title: "Global Clients",
      subtitle: "",
      textColor: "text-green-500"
    },
    {
      number: "30",
      title: "Countries & Territories",
      subtitle: "",
      textColor: "text-orange-500"
    }
  ];

  return (
    <div className="w-full bg-white py-16 relative z-0">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Being There <span className="text-green-500">Where</span>
            <span className="text-orange-500">ver</span>,
            <br />
            <span className="text-green-500">When</span>
            <span className="text-orange-500">ever</span> You Need Us
          </h2>
        </div>

        <div className="relative">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-5xl font-bold mb-2 ${stat.textColor}`}>
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-gray-800">
                  {stat.title}
                </div>
                {stat.subtitle && (
                  <div className="text-gray-600">
                    {stat.subtitle}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <a 
              href="#" 
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold"
            >
              Explore our Global Delivery Model
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalPresence; 