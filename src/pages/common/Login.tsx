import { Button, Typography, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const { Title } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const [form] = Form.useForm<LoginForm>();
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuthStore();

  const handleSubmit = async (values: LoginForm) => {
    try {
      await login(values.username, values.password);
      const currentError = useAuthStore.getState().error;
      
      if (!currentError) {
        message.success('Login successful!');
        navigate('/');
      } else {
        message.error(currentError);
      }
    } catch (e) {
      message.error('Login failed!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center space-y-2">
            <Title level={2} className="!text-slate-900 dark:!text-white !m-0">
              Welcome 
            </Title>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to continue to your account 
            </p>
          </div>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="space-y-4"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="Username"
                size="large"
                className="h-12"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                className="h-12"
              />
            </Form.Item>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                size="large"
                block
                className="h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 
                  hover:to-blue-700 border-0 shadow-lg hover:shadow-xl 
                  transition-all duration-200 text-base font-medium"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
} 