import { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, message,Avatar, Upload} from 'antd';
import { UserOutlined, UploadOutlined, KeyOutlined } from '@ant-design/icons';
import { useUserStore } from '../../stores/userStore';
import { employeeService } from '../../services/employee.service';
import { departmentService } from '../../services/Department.service';
import moment from 'moment';
import type { UploadProps } from 'antd';
import ChangePasswordModal from '../../components/user/ChangePasswordModal';
import { Employee, EmployeeUpdateData } from '../../models/EmployeeModel';
import { InputVaild } from '../../constants/InputVaild';
import { toast } from 'react-toastify';




const SettingUser = () => {
  const [form] = Form.useForm();
  const user = useUserStore((state) => state);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [departmentName, setDepartmentName] = useState<string>('');
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
          
          // Fetch department name
          if (data.department_code) {
            fetchDepartmentName(data.department_code);
          }
          
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

  // Fetch department name based on department code
  const fetchDepartmentName = async (departmentCode: string) => {
    try {
      const { data: departments } = await departmentService.getAllDepartments();
      const department = departments.find(dept => dept.department_code === departmentCode);
      if (department) {
        setDepartmentName(department.department_name);
        form.setFieldsValue({ department_name: department.department_name });
      }
    } catch (error) {
      console.error('Error fetching department data:', error);
    }
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    const confirmed = window.confirm('Are you sure you want to save these changes?');
    if (!confirmed) return;

    setLoading(true);
    try {
      if (!employeeData?._id) {
        toast.error('No employee data available');
        return;
      }

      // Only include editable fields in the update data
      const updateData: EmployeeUpdateData = {
        user_id: user.id,
        account: values.account,
        address: values.address,
        phone: values.phone,
        full_name: values.full_name,
        avatar_url: avatarUrl,
        // Preserve existing data for non-editable fields
        job_rank: employeeData.job_rank,
        contract_type: employeeData.contract_type,
        department_code: employeeData.department_code,
        salary: employeeData.salary,
        start_date: employeeData.start_date,
        end_date: employeeData.end_date,
        updated_by: user.id,
      };

      const response = await employeeService.updateEmployee(employeeData._id, updateData);
      setEmployeeData(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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
        toast.error('You can only upload JPG/PNG files!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        toast.error('Image must be smaller than 2MB!');
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col items-center">
                <Avatar 
                  size={160} 
                  src={avatarUrl || null}
                  icon={!avatarUrl && <UserOutlined />} 
                  className="mb-4 border-4 border-gray-100"
                />
                <Upload {...uploadProps}>
                  <Button 
                    icon={<UploadOutlined />}
                    className="mb-4"
                  >
                    Change Avatar
                  </Button>
                </Upload>
                <h2 className="text-xl font-semibold mb-2">{employeeData?.full_name || 'Employee Name'}</h2>
                <p className="text-gray-500 mb-4">{employeeData?.job_rank || 'Job Rank'}</p>
                
                {/* Quick Info */}
                <div className="w-full space-y-3 border-t pt-4">
                  <div>
                    <p className="text-gray-500 text-sm">Contract Type</p>
                    <p className="font-medium">{employeeData?.contract_type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Start Date</p>
                    <p className="font-medium">
                      {employeeData?.start_date ? moment(employeeData.start_date).format('DD/MM/YYYY') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">End Date</p>
                    <p className="font-medium">
                      {employeeData?.end_date ? moment(employeeData.end_date).format('DD/MM/YYYY') : 'N/A'}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      onClick={() => setIsPasswordModalVisible(true)}
                      icon={<KeyOutlined />}
                      className="w-full"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h1 className="text-2xl font-bold mb-6">Edit Profile Information</h1>
              
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  full_name: '',
                  avatar_url: '',
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
                <div className="space-y-6">
                  {/* Personal Details Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="full_name"
                        label="Full Name"
                        rules={InputVaild.required('Please enter your full name')}
                      >
                        <Input size="large" />
                      </Form.Item>
                      <Form.Item
                        name="account"
                        label="Account"
                        rules={InputVaild.required('Please enter your account')}
                      >
                        <Input size="large" />
                      </Form.Item>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                          ...InputVaild.required('Please enter your phone number'),
                          { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' }
                        ]}
                      >
                        <Input size="large" />
                      </Form.Item>
                      <Form.Item
                        name="address"
                        label="Address"
                        rules={InputVaild.required('Please enter your address')}
                      >
                        <Input size="large" />
                      </Form.Item>
                    </div>
                  </div>

                  {/* Employment Details - Read-only section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Employment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item name="salary" label="Salary">
                        <InputNumber 
                          disabled
                          size="large"
                          className="w-full"
                          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                      </Form.Item>
                      <Form.Item name="department_name" label="Department">
                        <Input disabled size="large" value={departmentName} />
                      </Form.Item>
                      <Form.Item name="job_rank" label="Job Rank">
                        <Input disabled size="large" />
                      </Form.Item>
                      <Form.Item name="contract_type" label="Contract Type">
                        <Input disabled size="large" />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    size="large"
                    className="px-8 bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                </div>
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
