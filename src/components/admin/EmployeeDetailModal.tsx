import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, DatePicker, InputNumber, Avatar, Input } from 'antd';
import { employeeService } from '../../services/employee.service';
import { EmployeeUpdateData } from '../../models/EmployeeModel';
import dayjs from 'dayjs';
import { departmentService } from '../../services/Department.service';
import { jobService } from '../../services/job.service';
import { contractService } from '../../services/contract.service';
import { DepartmentModel } from '../../models/DepartmentModel';
import { Job } from '../../models/JobModel';
import { Contract } from '../../models/ContractModel';
import { toast } from 'react-toastify';
import { InputVaild } from '../../constants/InputVaild';
import CommonField from './CommonFieldAddUser';
import { UserOutlined } from '@ant-design/icons';

interface EmployeeDetailModalProps {
  visible: boolean;
  employeeId: string;
  onClose: () => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  visible,
  employeeId,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (visible && employeeId) {
      fetchInitialData();
      fetchEmployeeData(employeeId);
    }
  }, [visible, employeeId]);

  const fetchInitialData = async () => {
    const [departmentsRes, jobsRes, contractsRes] = await Promise.all([
      departmentService.getAllDepartments(),
      jobService.getAllJobs(),
      contractService.getAllContracts(),
    ]);
    
    setDepartments(departmentsRes.data);
    setJobs(jobsRes.data);
    setContracts(contractsRes.data);
  };

  const fetchEmployeeData = async (employeeId: string) => {
    setLoading(true);
    try {
      const response = await employeeService.getEmployeeById(employeeId, {showSpinner:false});
      const employeeData = response.data;
      
      setAvatarPreview(employeeData.avatar_url || '');
      form.setFieldsValue({
        ...employeeData,
        user_id: employeeData.user_id,
        account: employeeData.account,
        avatar_url: employeeData.avatar_url,
        start_date: employeeData.start_date ? dayjs(employeeData.start_date) : null,
        end_date: employeeData.end_date ? dayjs(employeeData.end_date) : null,
      });
    } catch (error) {
      toast.error('Failed to fetch employee data');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    if (!employeeId) return;
    
    setLoading(true);
    try {
      const updateData: EmployeeUpdateData = {
        ...values,
        start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
        end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null,
        salary: values.salary ? Number(values.salary) : null,
        user_id: values.user_id || employeeId,
        account: values.account?.trim(),
        full_name: values.full_name?.trim(),
      };
  
      await employeeService.updateEmployee(employeeId, updateData, {showSpinner:false});
      toast.success('Update employee information successfully!');
      onClose();
    } catch (error) {
      toast.error('An error occurred while updating employee information!');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setAvatarPreview(url);
    form.setFieldValue('avatar_url', url);
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={null}
      centered
      className="employee-modal"
      title={
        <div className="text-xl font-semibold text-gray-800 text-center pb-4">
          Employee Information
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="px-6 py-4"
      >
        <div className="grid grid-cols-12 gap-6">
          {/* Avatar Preview Section */}
          <div className="col-span-3 bg-gray-50 p-6 rounded-xl flex flex-col items-center justify-center">
            <div className="mb-6 relative group">
              <Avatar 
                size={160}
                src={avatarPreview}
                icon={!avatarPreview && <UserOutlined />}
                className="shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              {avatarPreview && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                  <img 
                    src={avatarPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = ''; // Set to default avatar or error image
                    }}
                  />
                </div>
              )}
            </div>
            <Form.Item
              name="avatar_url"
              label="Avatar URL"
              className="w-full"
              rules={[
                { required: true, message: "Please input avatar URL!" },
                { type: 'url', message: "Please enter a valid URL!" }
              ]}
            >
              <Input 
                placeholder="Enter image URL"
                onChange={handleAvatarUrlChange}
                className="rounded-lg"
                allowClear
              />
            </Form.Item>
          </div>

          {/* Main Information Sections */}
          <div className="col-span-9 grid grid-cols-3 gap-4">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 border-l-4 border-blue-500 pl-2">
                Basic Information
              </h3>
              <CommonField 
                name="full_name"
                label="Full Name"
                rules={InputVaild.required("Please input full name!")}
              />
              <CommonField 
                name="account"
                label="Account"
                disabled
                className="bg-gray-100"
              />
              <CommonField 
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: "Please input phone number!" },
                  { pattern: /^\d{10}$/, message: "Please enter a valid phone number!" }
                ]}
              />
              <CommonField 
                name="address"
                label="Address"
                type="textarea"
                rules={InputVaild.required("Please input address!")}
              />
            </div>

            {/* Work Information */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 border-l-4 border-green-500 pl-2">
                Work Information
              </h3>
              <CommonField 
                name="job_rank"
                label="Job Rank"
                type="select"
                rules={InputVaild.required("Please select job rank!")}
                options={jobs.map(job => ({
                  label: job.job_rank,
                  value: job.job_rank
                }))}
              />
              <CommonField 
                name="department_code"
                label="Department"
                type="select"
                rules={InputVaild.required("Please select department!")}
                options={departments.map(dept => ({
                  label: dept.department_name,
                  value: dept.department_code
                }))}
              />
              <CommonField 
                name="contract_type"
                label="Contract Type"
                type="select"
                rules={InputVaild.required("Please select contract type!")}
                options={contracts.map(contract => ({
                  label: contract.contract_type,
                  value: contract.contract_type
                }))}
              />
            </div>

            {/* Other Information */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 border-l-4 border-purple-500 pl-2">
                Other Information
              </h3>
              <Form.Item 
                name="salary" 
                label="Salary"
                rules={[
                  { required: true, message: "Please input salary!" },
                  { type: 'number', message: "Please enter a valid number!" }
                ]}
              >
                <InputNumber 
                  className="w-full rounded-lg"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  parser={value => value!.replace(/\./g, '')}
                />
              </Form.Item>
              <Form.Item 
                name="start_date" 
                label="Start Date"
                rules={InputVaild.required("Please select start date!")}
              >
                <DatePicker className="w-full rounded-lg" />
              </Form.Item>
              <Form.Item 
                name="end_date" 
                label="End Date"
              >
                <DatePicker className="w-full rounded-lg" />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="px-8 py-2 h-auto text-base font-medium rounded-lg bg-blue-600 hover:bg-blue-700 min-w-[200px]"
          >
            Update Information
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

// Add these styles to your CSS
const styles = `
.employee-modal .ant-modal-content {
  border-radius: 16px;
  overflow: hidden;
}

.employee-modal .ant-modal-header {
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 24px;
}

.employee-modal .ant-modal-body {
  padding: 0;
}

.employee-modal .ant-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.employee-modal .ant-input:hover,
.employee-modal .ant-select-selector:hover,
.employee-modal .ant-picker:hover {
  border-color: #4B5563;
}
`;

export default EmployeeDetailModal;
