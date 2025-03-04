import { lazy, Suspense,useEffect,useState } from 'react';
import Header from '../layout/header';
import Banner from '../layout/banner';
import UserSpinner from '../components/user/UserSpinner';

const IndustriesSelection = lazy(() => import('../components/industries/IndustriesSelection'));

const Footer = lazy(() => import('../layout/footer'));

const LoadingSection = () => (
    <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
    </div>
);

const Industries = () => {
    const [isLoading, setIsLoading] = useState(true);
      useEffect(() => {
          const timer = setTimeout(() => {
            setIsLoading(false);
          }, 500);
      
          return () => clearTimeout(timer);
        }, []);
      
        if (isLoading) {
          return <UserSpinner/>;
        }
    return (
        <div className="min-h-screen">
            <Header />
            <Banner
                title="Services & Industries"
                description="We empower enterprises to achieve highest potential with extensive capabilities,
domain expertise and cutting-edge AI solutions."
            />
            <Suspense fallback={<LoadingSection />}>
                <IndustriesSelection />
            </Suspense>
            <Suspense fallback={<LoadingSection />}>
                <Footer />
            </Suspense>
        </div>
    );
};

export default Industries; 