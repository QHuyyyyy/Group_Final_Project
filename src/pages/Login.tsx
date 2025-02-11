import { Button, Typography, Form, Input, message } from 'antd';
import { GoogleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext'
const { Title } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const [form] = Form.useForm<LoginForm>();
  const navigate = useNavigate();
  const { googleSignIn } = UserAuth();

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result.user) {
        localStorage.setItem('token', result.token);
        message.success('Login successfully!');
        navigate('/');
      }   
    } catch (e: unknown) { 

      if (typeof e === "string") {
         console.log(e.toUpperCase()) 
      } else if (e instanceof Error) {
          console.log(e.message )
      }
};
  };
  const handleSubmit = async (values: LoginForm) => {
    try {
      console.log('Form values:', values);
      message.success('Login successful!');
    } 
      catch (e: unknown) { 

        if (typeof e === "string") {
           console.log(e.toUpperCase()) 
        } else if (e instanceof Error) {
            console.log(e.message )
        }
  };
}
  
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
              rules={[{ required: true, message: 'Please enter your username!' }]}
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
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                className="h-12"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 
                  hover:to-blue-700 border-0 shadow-lg hover:shadow-xl 
                  transition-all duration-200 text-base font-medium"
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Or</span>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="default"
              icon={<GoogleOutlined />}
              size="large"
              block
              onClick={handleGoogleLogin}
              className="h-12 flex items-center justify-center bg-white hover:bg-slate-50 border-slate-200 
                dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600
                dark:text-white transition-colors"
            >
              <span className="ml-2">Continue with Google</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 