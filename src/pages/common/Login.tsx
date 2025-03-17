import { Button, Typography, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import loginBackground from '../../assets/login-background.png';

const { Title } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 space-y-8 border border-white/30">
          <div className="text-center space-y-3">
            <Title level={2} className="!text-white !m-0 !font-bold tracking-wide">
              Sign In
            </Title>
            <p className="text-white/80 text-lg font-medium">
              Access your account to continue
            </p>
          </div>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="space-y-6"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please enter your email!' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-white/60" />}
                placeholder="Email"
                size="large"
                className="h-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 hover:bg-white/30 transition-all rounded-xl"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-white/60" />}
                placeholder="Password" 
                size="large"
                className="h-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 hover:bg-white/30 transition-all rounded-xl"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-4">
              <Button 
                type="link" 
                onClick={() => navigate('/forgot-password')}
                className="text-white/80 hover:text-white font-medium transition-all duration-200 hover:scale-105"
              >
                Forgot Password?
              </Button>
              <Button 
                type="link" 
                onClick={() => navigate('/resend-token')}
                className="text-white/80 hover:text-white"
              >
                Resend Token
              </Button>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="h-12 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border-0 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold tracking-wide rounded-xl"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}