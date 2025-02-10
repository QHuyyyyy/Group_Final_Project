import React from 'react';
import Header from '../layout/header';
import Banner from '../layout/banner';
import ServicesSection from '../components/ServicesSection';
import GlobalPresence from '../components/GlobalPresence';
import CultureSection from '../components/CultureSection';
import Footer from '../layout/footer';

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Banner />
      <ServicesSection />
      <GlobalPresence />
      <CultureSection />
      <Footer />
    </div>
  );
};

export default Homepage; 