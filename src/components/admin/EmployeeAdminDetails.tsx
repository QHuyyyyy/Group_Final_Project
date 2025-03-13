import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, DatePicker, InputNumber, Select} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
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

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    fetchInitialData();
    if (id) {
      fetchEmployeeData(id);
    }
  }, [id]);

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
      const response = await employeeService.getEmployeeById(employeeId);
      const employeeData = response.data;
      
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
    if (!id) return;
    
    setLoading(true);
    try {
      const updateData: EmployeeUpdateData = {
        ...values,
        start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
        end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null,
        salary: values.salary ? Number(values.salary) : null,
        user_id: values.user_id || id,
        account: values.account?.trim(),
        full_name: values.full_name?.trim(),
      };
  
       const ss =  await employeeService.updateEmployee(id, updateData);
      console.log('result',ss)
      toast.success('Update employee information successfully!');
    } catch (error) {
      toast.error('An error occurred while updating employee information!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button 
          type="default" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard/user-manager')}
          className="hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 text-gray-600"
        >
          Back to User List
        </Button>

        <Card 
          title={<h2 className="text-2xl font-semibold text-gray-800">Employee Information</h2>} 
          className="shadow-md rounded-lg overflow-hidden"
        >
          <div className="mb-8 flex justify-center">
            {form.getFieldValue('avatar_url') && (
              <div className="relative group">
                <img
                  src={form.getFieldValue('avatar_url')}
                  alt="Employee avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
            )}
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={loading}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Section */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-center border-b pb-2">Profile</h3>
                <Form.Item name="full_name" label="Full Name">
                  <Input className="rounded-lg" />
                </Form.Item>
                <Form.Item name="account" label="Account">
                  <Input className="rounded-lg" />
                </Form.Item>
                <Form.Item name="phone" label="Phone">
                  <Input className="rounded-lg" />
                </Form.Item>
                <Form.Item name="address" label="Address">
                  <Input className="rounded-lg" />
                </Form.Item>
                <Form.Item name="avatar_url" label="Avatar URL">
                  <Input className="rounded-lg" />
                </Form.Item>
              </div>

              {/* Work Information Section */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-center border-b pb-2">Work Information</h3>
                <Form.Item name="job_rank" label="Job Rank">
                  <Select className="rounded-lg">
                    {jobs.map(job => (
                      <Select.Option key={job._id} value={job.job_rank}>
                        {job.job_title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="department_code" label="Department">
                  <Select className="rounded-lg">
                    {departments.map(dept => (
                      <Select.Option key={dept._id} value={dept.department_code}>
                        {dept.department_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="contract_type" label="Contract Type">
                  <Select className="rounded-lg">
                    {contracts.map(contract => (
                      <Select.Option key={contract._id} value={contract.contract_type}>
                        {contract.contract_type}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* Other Information Section */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-center border-b pb-2">Other Information</h3>
                <Form.Item name="salary" label="Salary">
                  <InputNumber 
                    className="w-full rounded-lg"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={value => value!.replace(/\./g, '')}
                  />
                </Form.Item>
                <Form.Item name="start_date" label="Start Date">
                  <DatePicker className="w-full rounded-lg" />
                </Form.Item>
                <Form.Item name="end_date" label="End Date">
                  <DatePicker className="w-full rounded-lg" />
                </Form.Item>
              </div>
            </div>

            <Form.Item className="mt-6 text-center">
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="w-full md:w-auto px-8 py-2 h-auto text-base font-medium rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Update Information
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDetails; 