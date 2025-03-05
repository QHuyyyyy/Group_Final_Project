import { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, message,Avatar, Upload, DatePicker } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useUserStore } from '../../stores/userStore';
import { employeeService } from '../../services/employeeService';
import moment from 'moment';
import type { UploadProps } from 'antd';

import { Employee } from '../../models/EmployeeModel';



const SettingUser = () => {
  const [form] = Form.useForm();
  const user = useUserStore((state) => state);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  // Fetch employee data when component mounts
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (user.id) {
          const data = await employeeService.getEmployeeById(user.id);
          console.log(data)
          setEmployeeData(data.data);
          setAvatarUrl(data.data.avatar_url);
          
          // Set form values
          form.setFieldsValue({
            full_name: data.data.full_name,
            phone: data.data.phone,
            address: data.data.address,
            account: data.data.account,
            job_rank: data.data.job_rank,
            contract_type: data.data.contract_type,
            department_name: data.data.department_name,
            salary: data.data.salary,
            start_date: data.data.start_date ? moment(data.data.start_date) : null,
            end_date: data.data.end_date ? moment(data.data.end_date) : null,
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
    setLoading(true);
    try {
      if (!employeeData) {
        message.error('No employee data available');
        return;
      }

      // Only include fields that the user can actually edit
      const updateData = {
        user_id: user.id,
        account: values.account,
        address: values.address,
        phone: values.phone,
        full_name: values.full_name,
        avatar_url: avatarUrl,
        // Keep these fields from the original data since they're displayed as disabled
        job_rank: employeeData.job_rank,
        contract_type: employeeData.contract_type,
        department_name: employeeData.department_name,
        salary: employeeData.salary,
        start_date: employeeData.start_date,
        end_date: employeeData.end_date,
        updated_by: user.id,
      };

      const updatedEmployee = await employeeService.updateEmployee(employeeData._id, updateData);
      
      // Update local state with the response data
      setEmployeeData(updatedEmployee.data);
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
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      // Prevent default upload behavior
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
                  <div>
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Change Avatar</Button>
                    </Upload>
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
                    name="phone"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
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
                    name="account"
                    label="Bank Account"
                    rules={[{ required: true, message: 'Please enter your bank account' }]}
                  >
                    <Input placeholder="Enter your bank account" />
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
                      className="w-full" 
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                      placeholder="Salary"
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
    </div>
  );
};

export default SettingUser;
