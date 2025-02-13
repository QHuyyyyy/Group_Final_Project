
import Header from "../layout/header";
import Banner from "../layout/banner";
import ServicesSection from "../components/home/ServicesSection";
import GlobalPresence from "../components/home/GlobalPresence";
import CultureSection from "../components/home/CultureSection";
import Footer from "../layout/footer";





const Homepage = () => {
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
