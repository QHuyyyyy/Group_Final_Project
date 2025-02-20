import { Button, Typography, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useApiStore } from '../../stores/apiStore';
import { useAuth } from '../../contexts/AuthContext';
import loginBackground from '../../assets/login-background.png';

const { Title } = Typography;


export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isLoading } = useApiStore();

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      await login(values.username, values.password);
      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (e) {
      message.error('Đăng nhập thất bại!');
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
              Welcome Back
            </Title>
            <p className="text-white/80 text-lg font-medium">
              Sign in to continue to your account 
            </p>
          </div>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="space-y-6"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-white/60" />}
                placeholder="Username"
                size="large"
                className="h-12 bg-white/20 border-white/30 text-white placeholder:text-white/60
                  focus:bg-white/30 hover:bg-white/30 transition-all"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-white/60" />}
                placeholder="Password" 
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
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
} 