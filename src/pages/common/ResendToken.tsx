import { Button, Typography, Form, Input } from 'antd';
import { KeyOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useApiStore } from '../../stores/apiStore';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import loginBackground from '../../assets/login-background.png';

const { Title } = Typography;

export default function ResendToken() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isLoading } = useApiStore();

  const handleSubmit = async (values: { email: string }) => {
    try {
      await authService.resendToken(values.email);
      localStorage.setItem('verifyEmail', values.email);
      toast.success('New token has been sent to your email!');
      navigate('/verify/token');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error sending token');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-md w-full">
        <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-8 border border-white/20">
          <div className="text-center space-y-2">
            <Title level={2} className="!text-white !m-0 !font-bold tracking-wide">
              Resend Token
            </Title>
            <p className="text-white/80 text-lg font-medium">
              Enter your email to receive a new token
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
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Invalid email format!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-white/60" />}
                placeholder="Email"
                size="large"
                className="h-12 bg-white/20 border-white/30 text-white placeholder:text-white/60
                  focus:bg-white/30 hover:bg-white/30 transition-all"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                size="large"
                block
                className="h-12 bg-[#1a4f95] hover:bg-[#0d3d7a] border-0 
                  shadow-lg hover:shadow-xl transition-all duration-200 
                  text-base font-semibold tracking-wide"
              >
                Send New Token
              </Button>
            </Form.Item>

            <div className="text-center">
              <Button 
                type="link" 
                onClick={() => navigate('/verify/token')}
                className="text-white/80 hover:text-white"
              >
                Back to Verification Page
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}