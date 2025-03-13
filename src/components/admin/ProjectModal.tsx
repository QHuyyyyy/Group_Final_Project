import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Empty, message } from 'antd';
import dayjs from 'dayjs';
import { ProjectData } from '../../models/ProjectModel';
import { CalendarOutlined,  ClockCircleOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';

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
  handleEndDateChange: (date: dayjs.Dayjs | null) => void;
  departments: Array<{
    value: string;
    label: string;
  }>;
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
  handleEndDateChange,
  departments,
}) => {
  const [form] = Form.useForm();
  const [memberSearchText, setMemberSearchText] = useState('');
  const [daysBetween, setDaysBetween] = useState<number>(0);

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

  useEffect(() => {
    const startDate = form.getFieldValue('startDate');
    const endDate = form.getFieldValue('endDate');
    if (startDate && endDate) {
      const days = endDate.diff(startDate, 'days');
      setDaysBetween(days);
    }
  }, [form.getFieldValue('startDate'), form.getFieldValue('endDate')]);

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

  const getFilteredUsers = (searchText: string, currentMembers: Array<{ userId: string; role: string }>, currentIndex: number) => {
    return users.filter(user => {
      const isNotSelected = !isMemberExist(user.value, currentMembers, currentIndex);
      
      const matchesSearch = searchText.trim() === '' || 
        user.label.toLowerCase().includes(searchText.toLowerCase());

      return isNotSelected && matchesSearch;
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {isEditMode ? 'Update Project' : 'Create New Project'}
          </h2>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="custom-modal"
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
        {/* Project Information Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <div className="w-1 h-4 bg-blue-500 rounded mr-2"></div>
            Project Information
          </h3>
          
          <div className="grid grid-cols-3 gap-x-6 mb-4">
            <Form.Item name="project_code" label="Project Code" rules={[{ required: true }]}>
              <Input placeholder="Enter project code" className="hover:border-blue-400 focus:border-blue-500" />
            </Form.Item>

            <Form.Item name="project_name" label="Project Name" rules={[{ required: true }]}>
              <Input placeholder="Enter project name" className="hover:border-blue-400 focus:border-blue-500" />
            </Form.Item>

            <Form.Item name="project_department" label="Department" rules={[{ required: true }]}>
              <Select 
                placeholder="Select department"
                className="hover:border-green-400 focus:border-green-500"
              >
                {departments.map(dept => (
                  <Select.Option key={dept.value} value={dept.value}>
                    {dept.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="project_description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea 
              rows={4} 
              placeholder="Enter project description" 
              className="hover:border-blue-400 focus:border-blue-500"
            />
          </Form.Item>

          {/* Timeline Section */}
          <div className="relative mt-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="w-4/12">
                <Form.Item label={
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-blue-500" />
                    <span>Start Date</span>
                  </div>
                } name="startDate" rules={[{ required: true }]}>
                  <DatePicker
                    style={{ width: '100%' }}
                    className="hover:border-blue-400 focus:border-blue-500 rounded-lg"
                    disabledDate={disabledStartDate}
                    onChange={(date) => {
                      handleStartDateChange(date);
                      const endDate = form.getFieldValue('endDate');
                      if (date && endDate) {
                        if (date.isAfter(endDate)) {
                          message.warning('Start date cannot be after end date');
                          form.setFieldValue('startDate', null);
                        } else {
                          setDaysBetween(endDate.diff(date, 'days'));
                        }
                      }
                    }}
                  />
                </Form.Item>
              </div>
              
              <div className="w-4/12">
                <div className="relative w-full">
                  {/* Timeline line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-indigo-400 to-purple-200"></div>
                  
                  {/* Days count badge */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white border-2 border-indigo-400 rounded-full px-3 py-1 flex items-center gap-1">
                      <ClockCircleOutlined className="text-indigo-500" />
                      <span className="text-sm font-medium text-gray-700">{daysBetween} days</span>
                    </div>
                  </div>
                  
                  {/* Decorative dots */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-500"></div>
                </div>
              </div>

              <div className="w-4/12">
                <Form.Item label={
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-purple-500" />
                    <span>End Date</span>
                  </div>
                } name="endDate" rules={[{ required: true }]}>
                  <DatePicker
                    style={{ width: '100%' }}
                    className="hover:border-purple-400 focus:border-purple-500 rounded-lg"
                    disabledDate={disabledEndDate}
                    onChange={(date) => {
                      handleEndDateChange(date);
                      const startDate = form.getFieldValue('startDate');
                      if (startDate && date) {
                        if (date.isBefore(startDate)) {
                          message.warning('End date cannot be before start date');
                          form.setFieldValue('endDate', null);
                        } else {
                          setDaysBetween(date.diff(startDate, 'days'));
                        }
                      }
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <div className="w-1 h-4 bg-purple-500 rounded mr-2"></div>
            Team Members
          </h3>

          <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-purple-200 transition-colors">
                <div className="grid grid-cols-2 gap-4">
                  {/* Member Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Member <span className="text-red-500">*</span>
                    </label>
                    <Select
                      showSearch
                      className="w-full hover:border-purple-400 focus:border-purple-500"
                      placeholder="Select member"
                      value={member.userId}
                      status={!member.userId && teamMembers.length > 0 ? 'error' : ''}
                      onChange={(value) => {
                        const newMembers = [...teamMembers];
                        newMembers[index].userId = value;
                        setTeamMembers(newMembers);
                      }}
                      onSearch={setMemberSearchText}
                      filterOption={false}
                      options={getFilteredUsers(memberSearchText, teamMembers, index)}
                      notFoundContent={memberSearchText ? <Empty description="No matching members" /> : <Empty description="Type to search" />}
                    />
                    {!member.userId && teamMembers.length > 0 && (
                      <div className="text-red-500 text-sm mt-1">Please select a member</div>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <Select
                        className="w-full hover:border-purple-400 focus:border-purple-500"
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
                    </div>
                    <Button 
                      danger
                      onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== index))}
                      className="self-end hover:bg-red-50 border-red-200"
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
              onClick={() => setTeamMembers([...teamMembers, { userId: '', role: '' }])}
              className="hover:border-purple-400 hover:text-purple-500 transition-colors"
              icon={<PlusOutlined />}
            >
              Add Team Member
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
          <Button onClick={onCancel} className="hover:bg-gray-50">
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0"
          >
            {isEditMode ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProjectModal;
