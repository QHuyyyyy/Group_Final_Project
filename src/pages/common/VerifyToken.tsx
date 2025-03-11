import { Button, Layout, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

import { authService } from '../../services/auth.service';
import { toast } from 'react-toastify';
import loginBackground from '../../assets/login-background.png';
import { useEffect, useState } from 'react';

export default function VerifyToken() {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const path = window.location.pathname;
        const tokenMatch = path.match(/verify-email\/([a-f0-9]+)/);
        
        if (tokenMatch && tokenMatch[1]) {
          const token = tokenMatch[1];
          await authService.verifyToken(token);
          setVerificationStatus('success');
          toast.success('Verification successful!');
        }
      } catch (error) {
        setVerificationStatus('error');
        toast.error('Verification failed!');
      }
    };

    verifyToken();
  }, []);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <Result
            title="Verifying..."
            subTitle="Please wait a moment"
            className="text-white"
          />
        );
      case 'success':
        return (
          <Result
            status="success"
            title="Account verification successful!"
            subTitle="You can now log in to the system"
            className="text-white"
            extra={[
              <Button 
                type="primary" 
                key="login"
                onClick={() => navigate('/login')}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Back to Login
              </Button>
            ]}
          />
        );
      case 'error':
        return (
          <Result
            status="error"
            title="Account verification failed!"
            subTitle="Token is invalid or has expired"
            className="text-white"
            extra={[
              <Button
                type="primary" 
                key="resend"
                onClick={() => navigate('/resend-token')}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Resend Token 
              </Button>,
              <Button
                key="home"
                onClick={() => navigate('/')}
                className="text-white border-white hover:text-blue-200 hover:border-blue-200"
              >
               Back to Login
              </Button>
            ]}
          />
        );
    }
  };

  return (
    <Layout style={{ 
      height: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      background: "#f0f2f5",
      backgroundImage: `url(${loginBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-8 border border-white/20">
        {renderContent()}
      </div>
    </Layout>
  );
}