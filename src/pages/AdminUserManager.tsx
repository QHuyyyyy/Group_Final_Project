import React, { useState } from 'react';
import { Table, Button, Form, Input, InputNumber, Modal, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import 'antd/dist/reset.css';

interface StaffMember {
  key: string;
  staffName: string;
  department: string;
  jobRank: string;
  salary: number;
  email: string;
  phone: string;
  address: string;
}

const AdminUserManager: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState<StaffMember | null>(null);
  const [staffData, setStaffData] = useState<StaffMember[]>([
    {
      key: '1',
      staffName: 'John Doe',
      department: 'IT',
      jobRank: 'Senior Developer',
      salary: 5000,
      email: 'john.doe@example.com',
      phone: '0123456789',
      address: '123 Main St, City'
    },
    {
      key: '2',
      staffName: 'Jane Smith',
      department: 'HR',
      jobRank: 'Manager',
      salary: 6000,
      email: 'jane.smith@example.com',
      phone: '0987654321',
      address: '456 Park Ave, Town'
    }
  ]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: StaffMember) => {
    setIsAdding(false);
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (isAdding) {
        const newStaff: StaffMember = {
          ...values,
          key: `${staffData.length + 1}`,
        };
        setStaffData([...staffData, newStaff]);
      } else {
        const newData = staffData.map(item => 
          item.key === editingRecord?.key ? { ...item, ...values } : item
        );
        setStaffData(newData);
      }
      setIsModalVisible(false);
      setEditingRecord(null);
      setIsAdding(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
      Modal.error({
        title: 'Error',
        content: 'Failed to save staff information. Please try again.',
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    setIsAdding(false);
    form.resetFields();
  };

  const handleDelete = (key: string) => {
    const newData = staffData.filter(item => item.key !== key);
    setStaffData(newData);
  };

  const columns: ColumnsType<StaffMember> = [
    {
      title: 'Staff Name',
      dataIndex: 'staffName',
      key: 'staffName',
      render: (text: string, record: StaffMember) => (
        <Tooltip
          title={
            <div>
              <p><strong>Email:</strong> {record.email}</p>
              <p><strong>Phone:</strong> {record.phone}</p>
              <p><strong>Address:</strong> {record.address}</p>
            </div>
          }
          placement="right"
        >
          <span className="cursor-pointer text-blue-600 hover:text-blue-800">
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Job Rank',
      dataIndex: 'jobRank',
      key: 'jobRank',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number) => (
        <span>
          {salary.toLocaleString('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="space-x-2">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete staff member"
            description="Are you sure you want to delete this staff member?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl">Staff Information</h2>
        <Button type="primary" onClick={handleAdd}>
          Add Staff
        </Button>
      </div>
      
      <Table columns={columns} dataSource={staffData} />

      <Modal
        title={isAdding ? "Add New Staff" : "Edit Staff Information"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingRecord || {}}
        >
          <Form.Item
            name="staffName"
            label="Staff Name"
            rules={[{ required: true, message: 'Please input staff name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please input department!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="jobRank"
            label="Job Rank"
            rules={[{ required: true, message: 'Please input job rank!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="salary"
            label="Salary"
            rules={[{ required: true, message: 'Please input salary!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              precision={2}
              step={0.01}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please input phone number!' },
              { pattern: /^[0-9]{10,11}$/, message: 'Please enter a valid phone number!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[
              { required: true, message: 'Please input address!' },
              { min: 5, message: 'Address must be at least 5 characters!' }
            ]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Enter full address"
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserManager;