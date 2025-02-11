import { lazy, Suspense } from 'react';
import Header from '../layout/header';
import Banner from '../layout/banner';

const ServicesSection = lazy(() => import('../components/ServicesSection'));
const GlobalPresence = lazy(() => import('../components/GlobalPresence')); 
const CultureSection = lazy(() => import('../components/CultureSection'));
const Footer = lazy(() => import('../layout/footer'));

const LoadingSection = () => (
  <div className="h-96 flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Banner />
      <Suspense fallback={<LoadingSection />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <GlobalPresence />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <CultureSection />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Homepage; 