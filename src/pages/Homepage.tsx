import { lazy, Suspense, useState, useEffect } from 'react';
import Header from '../layout/header';
import Banner from '../layout/banner';
import UserSpinner from '../components/user/UserSpinner';

const ServicesSection = lazy(() => import('../components/home/ServicesSection'));
const GlobalPresence = lazy(() => import('../components/home/GlobalPresence')); 
const CultureSection = lazy(() => import('../components/home/CultureSection'));
const Footer = lazy(() => import('../layout/footer'));



const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <UserSpinner/>;
  }
  return (
    <div className="min-h-screen">
      <Header />
      <Banner 
       title="We Are A Comprehensive Technology Enabler" 
       description="For complex business challenges and opportunitie" />
      <Suspense fallback={<UserSpinner />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<UserSpinner />}>
        <GlobalPresence />
      </Suspense>
      <Suspense fallback={<UserSpinner />}>
        <CultureSection />
      </Suspense>
      <Suspense fallback={<UserSpinner />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Homepage; 