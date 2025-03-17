import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, DatePicker, InputNumber } from 'antd';
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
  
      await employeeService.updateEmployee(employeeId, updateData);
      toast.success('Update employee information successfully!');
      onClose();
    } catch (error) {
      toast.error('An error occurred while updating employee information!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={null}
      title={<h2 className="text-2xl font-semibold text-gray-800">Employee Information</h2>}
    >
      <div className="p-4">
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
              <CommonField 
                name="full_name"
                label="Full Name"
                rules={InputVaild.required("Please input full name!")}
              />
              <CommonField 
                name="account"
                label="Account"
                rules={InputVaild.required("Please input account!")}
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
                rules={InputVaild.required("Please input address!")}
              />
              <CommonField 
                name="avatar_url"
                label="Avatar URL"
                rules={[
                  { required: true, message: "Please input avatar URL!" },
                  { type: 'url', message: "Please enter a valid URL!" }
                ]}
              />
            </div>

            {/* Work Information Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-center border-b pb-2">Work Information</h3>
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

            {/* Other Information Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-center border-b pb-2">Other Information</h3>
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
      </div>
    </Modal>
  );
};

export default EmployeeDetailModal;
