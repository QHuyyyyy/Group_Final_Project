import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import { ProjectData } from '../../models/ProjectModel';

interface ProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: ProjectData;
  isEditMode: boolean;
  users: any[];
  disabledStartDate: (current: dayjs.Dayjs) => boolean;
  disabledEndDate: (current: dayjs.Dayjs) => boolean;
  teamMembers: Array<{ userId: string; role: string }>;
  setTeamMembers: React.Dispatch<React.SetStateAction<Array<{ userId: string; role: string }>>>;
  handleStartDateChange: (date: dayjs.Dayjs | null) => void;
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
  handleStartDateChange,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode && initialValues) {
      form.setFieldsValue({
        project_name: initialValues.project_name,
        project_code: initialValues.project_code,
        project_department: initialValues.project_department,
        project_description: initialValues.project_description,
        project_status: initialValues.project_status,
        startDate: dayjs(initialValues.project_start_date),
        endDate: dayjs(initialValues.project_end_date),
      });
    }
  }, [form, initialValues, isEditMode]);

  const isMemberExist = (userId: string, members: Array<{ userId: string; role: string }>, currentIndex: number) => {
    return members.some((member, index) => index !== currentIndex && member.userId === userId);
  };

  const getAvailableRoles = (members: Array<{ userId: string; role: string }>, currentRole: string) => {
    const baseRoles = [
      { value: 'Project Manager', label: 'Project Manager' },
      { value: 'Quality Analytics', label: 'Quality Analytics' },
      { value: 'Technical Leader', label: 'Technical Leader' },
      { value: 'Business Analytics', label: 'Business Analytics' },
      { value: 'Developer', label: 'Developer' },
      { value: 'Tester', label: 'Tester' },
      { value: 'Technical Consultant', label: 'Technical Consultant' }
    ];

    return baseRoles.filter(role => {
      if (role.value === currentRole) return true;
      
      if ((role.value === 'Project Manager' || role.value === 'Quality Analytics') 
          && members.some(m => m.role === role.value)) {
        return false;
      }
      return true;
    });
  };

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
        initialValues={isEditMode ? {
          project_name: initialValues?.project_name,
          project_code: initialValues?.project_code,
          project_department: initialValues?.project_department,
          project_description: initialValues?.project_description,
          project_status: initialValues?.project_status,
          startDate: initialValues ? dayjs(initialValues.project_start_date) : null,
          endDate: initialValues ? dayjs(initialValues.project_end_date) : null,
        } : undefined}
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
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="project_description"
            label="Description"
            rules={[{ required: true, message: 'Please input project description!' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter project description" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-x-6">
          

            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: 'Please select start date!' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                className="rounded-md"
                disabledDate={disabledStartDate}
                onChange={handleStartDateChange}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member <span className="text-red-500">*</span>
                  </label>
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select member"
                    value={member.userId}
                    status={!member.userId && teamMembers.length > 0 ? 'error' : ''}
                    onChange={(value) => {
                      const newMembers = [...teamMembers];
                      newMembers[index].userId = value;
                      setTeamMembers(newMembers);
                    }}
                    options={users.filter(user => !isMemberExist(user.value, teamMembers, index))}
                  />
                  {!member.userId && teamMembers.length > 0 && (
                    <div className="text-red-500 text-sm mt-1">Please select a member</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Select role"
                      value={member.role}
                      status={!member.role && teamMembers.length > 0 ? 'error' : ''}
                      onChange={(value) => {
                        const newMembers = [...teamMembers];
                        newMembers[index].role = value;
                        setTeamMembers(newMembers);
                      }}
                      options={getAvailableRoles(teamMembers, member.role)}
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
                  {!member.role && teamMembers.length > 0 && (
                    <div className="text-red-500 text-sm mt-1">Please select a role</div>
                  )}
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
          <Button type="primary" htmlType="submit">
            {isEditMode ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProjectModal;
