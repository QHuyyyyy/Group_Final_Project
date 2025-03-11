import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

interface ProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
  isEditMode: boolean;
  users: any[];
  disabledStartDate: (current: dayjs.Dayjs) => boolean;
  disabledEndDate: (current: dayjs.Dayjs) => boolean;
  teamMembers: Array<{ userId: string; role: string }>;
  setTeamMembers: React.Dispatch<React.SetStateAction<Array<{ userId: string; role: string }>>>;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  isEditMode,
  users,
  disabledStartDate,
  disabledEndDate,
  teamMembers,
  setTeamMembers,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={<h2 className="text-2xl font-semibold text-gray-800 mb-4">{isEditMode ? 'Update Project' : 'Create New Project'}</h2>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={initialValues}
      >
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Project Information</h3>
          <div className="grid grid-cols-3 gap-x-6 mb-4">
            <Form.Item
              name="project_code"
              label="Project Code"
              rules={[{ required: true, message: 'Please input project code!' }]}
            >
              <Input placeholder="Enter project code" />
            </Form.Item>

            <Form.Item
              name="project_name"
              label="Project Name"
              rules={[{ required: true, message: 'Please input project name!' }]}
            >
              <Input placeholder="Enter project name" />
            </Form.Item>

            <Form.Item
              name="project_department"
              label="Department"
              rules={[{ required: true, message: 'Please select department!' }]}
            >
              <Select placeholder="Select department">
                <Select.Option value="IT">IT Department</Select.Option>
                <Select.Option value="HR">HR Department</Select.Option>
                <Select.Option value="Marketing">Marketing Department</Select.Option>
                <Select.Option value="Sales">Sales Department</Select.Option>
                <Select.Option value="Finance">Finance Department</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="mb-4">
            <Form.Item
              name="project_description"
              label="Description"
              rules={[{ required: true, message: 'Please input project description!' }]}
            >
              <Input.TextArea rows={4} placeholder="Enter project description" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-x-6 mb-4">
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: 'Please select start date!' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                className="rounded-md"
                disabledDate={disabledStartDate}
              />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: 'Please select end date!' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={disabledEndDate}
              />
            </Form.Item>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Team Members</h3>
          <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {teamMembers.map((member, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-4 items-start">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn thành viên"
                    value={member.userId}
                    onChange={(value) => {
                      const newMembers = [...teamMembers];
                      newMembers[index].userId = value;
                      setTeamMembers(newMembers);
                    }}
                    options={users}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <div className="flex gap-2">
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Chọn vai trò"
                      value={member.role}
                      onChange={(value) => {
                        const newMembers = [...teamMembers];
                        newMembers[index].role = value;
                        setTeamMembers(newMembers);
                      }}
                      options={[
                        { value: 'Project Manager', label: 'Project Manager' },
                        { value: 'Quality Analytics', label: 'Quality Analytics' },
                        { value: 'Technical Leader', label: 'Technical Leader' },
                        { value: 'Business Analytics', label: 'Business Analytics' },
                        { value: 'Developer', label: 'Developer' },
                        { value: 'Tester', label: 'Tester' },
                        { value: 'Technical Consultant', label: 'Technical Consultant' }
                      ]}
                    />
                    <Button 
                      danger
                      onClick={() => {
                        setTeamMembers(teamMembers.filter((_, i) => i !== index));
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="dashed"
              block
              onClick={() => {
                setTeamMembers([...teamMembers, { userId: '', role: '' }]);
              }}
              className="mt-4"
            >
              + Add Member
            </Button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">{isEditMode ? 'Update Project' : 'Create Project'}</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProjectModal; 