import { Spin, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined } from "@ant-design/icons";
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import loginBackground from '../../assets/login-background.png';
import { useEffect, useState } from 'react';

export default function VerifyToken() {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const path = window.location.pathname;
        const tokenMatch = path.match(/verify-email\/([a-f0-9]+)/);
        
        if (tokenMatch && tokenMatch[1]) {
          const token = tokenMatch[1];
          
          await authService.verifyToken(token);
          
          // Show success toast only once
          toast.success('Tài khoản đã được xác thực thành công!');
        }
      
      } finally {
        // Always navigate to login, regardless of success or failure
        navigate('/login');
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [navigate]);

  const loadingIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

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
      {isVerifying ? (
        <div style={{ textAlign: "center" }}>
          <Spin indicator={loadingIcon} />
          <h2 style={{ marginTop: 20, color: "#fff" }}>Đang xác thực tài khoản...</h2>
          <p style={{ color: "#fff" }}>Vui lòng đợi trong giây lát</p>
        </div>
      ) : null}
    </Layout>
  );
}