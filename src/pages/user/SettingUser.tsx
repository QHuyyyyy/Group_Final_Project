import { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, message,Avatar, Upload, DatePicker } from 'antd';
import { UserOutlined, UploadOutlined, LockOutlined } from '@ant-design/icons';
import { useUserStore } from '../../stores/userStore';
import { employeeService } from '../../services/employee.service';
import moment from 'moment';
import type { UploadProps } from 'antd';
import ChangePasswordModal from '../../components/user/ChangePasswordModal';
import { Employee, EmployeeUpdateData } from '../../models/EmployeeModel';



const SettingUser = () => {
  const [form] = Form.useForm();
  const user = useUserStore((state) => state);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);



  // Fetch employee data when component mounts
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (user.id) {
          const { data } = await employeeService.getEmployeeById(user.id);
          setEmployeeData(data);
          setAvatarUrl(data.avatar_url);
          
          // Set form values with all available fields
          form.setFieldsValue({
            ...data,
            start_date: data.start_date ? moment(data.start_date) : null,
            end_date: data.end_date ? moment(data.end_date) : null,
          });
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        message.error('Failed to load employee data');
      }
    };

    fetchEmployeeData();
  }, [user.id, form]);

  // Handle form submission
  const onFinish = async (values: any) => {
    const confirmed = window.confirm('Are you sure you want to save these changes?');
    if (!confirmed) return;

    setLoading(true);
    try {
      if (!employeeData?._id) {
        message.error('No employee data available');
        return;
      }

      const updateData: EmployeeUpdateData = {
        user_id: user.id,
        account: values.account,
        address: values.address,
        phone: values.phone,
        full_name: values.full_name,
        avatar_url: avatarUrl,
        job_rank: employeeData.job_rank,
        contract_type: employeeData.contract_type,
        department_code: employeeData.department_code,
        salary: employeeData.salary,
        start_date: employeeData.start_date,
        end_date: employeeData.end_date,
        updated_by: user.id,
      };

      const { data: updatedEmployee } = await employeeService.updateEmployee(employeeData._id, updateData);
      setEmployeeData(updatedEmployee);
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Mock upload props (in a real app, you would implement actual file upload)
  const uploadProps: UploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG files!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      return false;
    },
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="flex">
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex justify-center mb-8">
                <div className="text-center">
                  <Avatar 
                    size={130} 
                    src={avatarUrl}
                    icon={!avatarUrl && <UserOutlined />} 
                    className="mb-4"
                  />
                  <div className="flex space-x-4 justify-center mt-2">
                    <Upload {...uploadProps}>
                      <Button 
                        icon={<UploadOutlined />}
                        style={{ width: 150 }}
                        className="flex items-center justify-center"
                      >
                        Change Avatar
                      </Button>
                    </Upload>
                    <Button 
                      icon={<LockOutlined />}
                      onClick={() => setIsPasswordModalVisible(true)}
                      style={{ width: 150 }}
                      className="flex items-center justify-center"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  full_name: '',
                  phone: '',
                  address: '',
                  account: '',
                  job_rank: '',
                  contract_type: '',
                  department_name: '',
                  salary: 0,
                  start_date: null,
                  end_date: null,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    name="full_name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your full name' }]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>
                  <Form.Item
                    name="account"
                    label="Account"
                    rules={[{ required: true, message: 'Please enter your account' }]}
                  >
                    <Input placeholder="Enter your account" />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                      { required: true, message: 'Please enter your phone number' },
                      { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' }
                    ]}
                  >
                    <Input placeholder="Enter your phone number" />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: 'Please enter your address' }]}
                  >
                    <Input placeholder="Enter your address" />
                  </Form.Item>

                  <Form.Item
                    name="job_rank"
                    label="Job Rank"
                  >
                    <Input disabled placeholder="Job Rank" />
                  </Form.Item>

                  <Form.Item
                    name="contract_type"
                    label="Contract Type"
                  >
                    <Input disabled placeholder="Contract Type" />
                  </Form.Item>

                  <Form.Item
                    name="department_name"
                    label="Department"
                  >
                    <Input disabled placeholder="Department" /> 
                  </Form.Item>

                  <Form.Item
                    name="salary"
                    label="Salary"
                  >
                    <InputNumber 
                      // className="w-full" 
                      // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      // parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                      placeholder="Salary"
                      disabled
                    />
                  </Form.Item>

                  <Form.Item
                    name="start_date"
                    label="Start Date"
                  >
                    <DatePicker disabled format="DD/MM/YYYY" placeholder="Start Date" />
                  </Form.Item>

                  <Form.Item
                    name="end_date"
                    label="End Date"
                  >
                    <DatePicker disabled format="DD/MM/YYYY" placeholder="End Date" />
                  </Form.Item>
                </div>

                <Form.Item className="mt-6">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Save 
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        visible={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        onSuccess={() => setIsPasswordModalVisible(false)}
      />
    </div>
  );
};

export default SettingUser;
