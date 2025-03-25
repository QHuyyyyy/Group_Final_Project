import { Modal, Button } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

interface PaymentConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  count?: number;
}

const PaymentConfirmationModal = ({ visible, onCancel, onConfirm, count = 1 }: PaymentConfirmationModalProps) => {
  return (
    <Modal
      title={<h2 className="text-2xl font-bold text-center text-green-800">Payment Confirmation <DollarOutlined style={{ color: 'green', fontSize: '30px' }} className="mb-2 animate-bounce" /></h2>}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 rounded-md transition duration-200">
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={onConfirm}
          className="bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-200 flex items-center"
        >
          <DollarOutlined className="mr-2" />
          Confirm Payment
        </Button>
      ]}
      width={600}
      className="rounded-lg shadow-lg relative"
      style={{ zIndex: 1000, backgroundColor: '#ffffff' }}
    >
      <div className="flex flex-col items-center justify-center mb-4">
        <p className="text-lg text-center text-gray-800 mb-2">
          Are you sure you want to mark {count > 1 ? `${count} claims` : 'this claim'} as paid?
        </p>
        <span className="font-semibold text-red-600">This action cannot be undone.</span>
      </div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-green-100 opacity-50 rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-1/8 h-1/4 bg-green-100 opacity-50 rounded-br-lg"></div>
      <div className="absolute top-0 left-0 w-1/9 h-1/6 bg-green-100 opacity-50 rounded-br-lg"></div>
    </Modal>
  );
};

export default PaymentConfirmationModal; 