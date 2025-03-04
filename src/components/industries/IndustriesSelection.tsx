

const IndustriesSelection = () => {
  
    const industries = [
        { title: "Aviation", icon: "https://media.istockphoto.com/id/1414160809/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-m%C3%A1y-bay-h%C3%ACnh-%E1%BA%A3nh-chuy%E1%BA%BFn-bay-m%C3%A1y-bay-giao-th%C3%B4ng-v%E1%BA%ADn-t%E1%BA%A3i-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-du-l%E1%BB%8Bch.jpg?s=612x612&w=0&k=20&c=EQ6ezDgXyPO8sLUDOBcCz0ZMJXpwZiNSPkmyYqHQXII=", description: "With over a decade of experience with 100+ aviation leaders, FPT Software integrates systems, optimizes operations, enhances customer experiences and supports net-zero transition." },
        { title: "Automotive", icon: "https://png.pngtree.com/png-vector/20190507/ourmid/pngtree-vector-car-icon-png-image_1024782.jpg", description: "We deliver services to automakers, Tier-1 suppliers and semiconductor firms to innovate. With 5000+ engineers, we support Vietnam's rise as an automotive tech hub." },
        { title: "Banking & Financial Services", icon: "https://media.istockphoto.com/id/1465234647/vi/vec-to/ng%C3%A2n-h%C3%A0ng-c%C3%B3-k%C3%BD-hi%E1%BB%87u-%C4%91%C3%B4-la-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-c%C3%B3-h%C3%ACnh-%E1%BA%A3nh-ph%E1%BA%A3n-chi%E1%BA%BFu-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng.jpg?s=1024x1024&w=is&k=20&c=6-YbNI8h1JcfNX8FuZmvXfjIl7iF3iI53knKIEBwwWk=", description: "For 20+ years, we help financial institutions modernize with AI-enabled services, to innovate with cloud, data, and AI, to enhance agility and resilience." },
        { title: "Consumer Packaged Goods", icon: "https://www.shutterstock.com/image-vector/shopping-cart-packages-icon-vector-600nw-2436412699.jpg", description: "Transform with our solution to enhance digital capabilities and customer personalization, to drive sustainable growth and boost customer loyalty." },
        { title: "Energy & Utilities", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnmmWgfDo0SL_YvGssJCdLMmx6O0VogiURCpF_m2-oKeEz-1Ncv6zcuZ7T4fdljrSYJJA&usqp=CAU", description: "We deliver comprehensive services enabled by AI, and flexible global delivery to enhance resilience and agility amid industry shifts." },
        { title: "Healthcare", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrzJboOugJcgOq8mQPZQB1soo-nL0m_uLHvA&s", description: "For 20+ years, we offer tailored solutions to streamline operations and improve patient care, focusing on medical devices, digital health, virtual care and more." },
        { title: "Insurance", icon: "https://media.istockphoto.com/id/1131997007/vector/medical-insurance-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=5abpGm7z6XIAVjoXcjm_YR1yAdhEvU4a7YXAahpo358=", description: "We leverage AI and automation to help insurers become digital-first, resilient and competitive, ensuring efficient operations and personalized experiences." },
        { title: "Logistics", icon: "https://cdn-icons-png.flaticon.com/512/46/46057.png", description: "We leverage IoT, AI, and Cloud to boost efficiency and innovation for logistics companies. Our flexible model optimizes costs and fuels higher margins globally." },
        { title: "Manufacturing", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB0fRMdBE0qe1KRsp9cMoVfF-H3XVP-KtO8997BTh6U1RRqAeXdcIwwHMkRyga3nB8LIg&usqp=CAU", description: "With 150+ manufacturing clients, we use AI, IoT and automation to transform production lines into smart factories, enhancing efficiency and supply chain resilience." },
        { title: "Media & Entertainment", icon: "https://cdn-icons-png.flaticon.com/512/2344/2344677.png", description: "We innovate with AI to help media companies enhance content delivery, engagement and advertising, creating new revenue streams and reducing time-to-market." },
        { title: "Retail", icon: "https://static.vecteezy.com/system/resources/thumbnails/000/583/708/small/shop.jpg", description: "We support 100+ retail clients to improve efficiency and engagement with AI-powered insights, omnichannel strategies, and data-driven supply chain optimization." },
      ];

  return (
    <div className="w-full bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-green-500">Industr</span>
            <span className="text-orange-500">ies</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our industry-spanning services and solutions enable enterprises to enhance resilience,
            agility, and global competitiveness.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((industry, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <img 
                  src={industry.icon} 
                  alt={industry.title} 
                  className="w-12 h-12 mb-4 object-contain"
                />
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-orange-500 transition-colors">
                  {industry.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndustriesSelection;