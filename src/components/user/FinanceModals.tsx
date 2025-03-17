import { Modal, Button, Card, Tag } from 'antd';
import { DollarOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Claim } from '../../models/ClaimModel';

interface ViewModalProps {
  isVisible: boolean;
  claim: Claim | null;
  onClose: () => void;
  getStatusColor: (status: string) => string;
}

interface BatchConfirmModalProps {
  isVisible: boolean;
  selectedCount: number;
  isProcessing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ViewClaimModal = ({ isVisible, claim, onClose, getStatusColor }: ViewModalProps) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-500" />
          <span className="text-lg font-medium">Claim Details</span>
        </div>
      }
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} size="large" className="px-6">
          Close
        </Button>,
      ]}
      width={800}
      className="details-modal"
    >
      {claim && (
        <div className="p-2">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{claim.claim_name}</h2>
            </div>
            <Tag
              color={getStatusColor(claim.claim_status)}
              className="px-3 py-1 text-base"
            >
              {claim.claim_status}
            </Tag>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <Card title="Staff Information" className="shadow-sm">
              <p><strong>Name:</strong> {claim.staff_name}</p>
              <p><strong>ID:</strong> {claim.staff_id}</p>
              <p><strong>Email:</strong> {claim.staff_email}</p>
            </Card>

            <Card title="Project Information" className="shadow-sm">
              <p><strong>Project:</strong> {claim.project_info?.project_name || "N/A"}</p>
              <p><strong>Role:</strong> {claim.role_in_project || "N/A"}</p>
              <p><strong>Work Time:</strong> {claim.total_work_time || "N/A"} hours</p>
            </Card>
          </div>

          <Card title="Claim Period" className="p-5 rounded-lg mb-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="text-center">
                <div className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">
                  {dayjs(claim.claim_start_date).format("DD MMM YYYY")}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {dayjs(claim.claim_start_date).format("HH:mm")}
                </p>
              </div>
              <div className="flex-2 mx-4 relative mb-8">
                <div className="h-0.5 bg-blue-300 w-full absolute top-1/2 transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-gray-500 font-medium border border-blue-200 rounded-full">
                  {`${claim.total_work_time} hours`}
                </div>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">
                  {dayjs(claim.claim_end_date).format("DD MMM YYYY")}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {dayjs(claim.claim_end_date).format("HH:mm")}
                </p>
              </div>
            </div>
          </Card>

          <Card title="Additional Information" className="shadow-sm !mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Created Date</p>
                <p className="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {dayjs(claim.created_at).format("DD MMM YYYY HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {dayjs(claim.updated_at).format("DD MMM YYYY HH:mm")}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Modal>
  );
};

export const BatchPaymentConfirmModal = ({ isVisible, selectedCount, isProcessing, onCancel, onConfirm }: BatchConfirmModalProps) => {
  return (
    <Modal
      title={
        <h2 className="text-2xl font-bold text-center text-green-800">
          Batch Payment Confirmation 
          <DollarOutlined style={{ color: 'green', fontSize: '30px' }} className="ml-2 mb-2 animate-bounce" />
        </h2>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button 
          key="cancel" 
          onClick={onCancel} 
          className="bg-gray-300 hover:bg-gray-400 rounded-md transition duration-200"
          disabled={isProcessing}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onConfirm}
          loading={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-200 flex items-center"
        >
          <DollarOutlined className="mr-2" />
          Confirm Payment
        </Button>
      ]}
      width={600}
      className="rounded-lg shadow-lg"
    >
      <div className="flex flex-col items-center justify-center mb-4">
        <p className="text-lg text-center text-gray-800 mb-2">
          Are you sure you want to mark {selectedCount} claims as paid?
        </p>
        <span className="font-semibold text-red-600">This action cannot be undone.</span>
      </div>
    </Modal>
  );
}; 