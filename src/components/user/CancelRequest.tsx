import { useState } from "react";
import { Modal, notification, Input } from "antd";

import { SendOutlined, QuestionCircleOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

interface CancelRequestProps {
    id: string | null;
    visible: boolean;
    onCancelRequest: (id: string, comment: string) => Promise<void>;
    onClose: () => void;
}

const { TextArea } = Input;

const CancelRequest: React.FC<CancelRequestProps> = ({ id, visible, onCancelRequest, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');  // Thêm state cho comment

    const handleCancel = async () => {
        if (id === null) return;
        setLoading(true);

        try {
            await onCancelRequest(id, comment);  // Gọi hàm onCancelRequest truyền id và comment

            notification.open({
                message: 'Success',
                description: `Request ID ${id} has been cancelled successfully.`,
                icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
                placement: 'topRight',
                duration: 4.5,
                style: {
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f'
                }
            });

            setComment('');  // Reset comment sau khi hủy thành công
            onClose();  // Đóng modal sau khi thành công
        } catch (error) {
            notification.open({
                message: 'Error',
                description: 'Failed to cancel the request.',
                icon: <CloseCircleFilled style={{ color: '#ff4d4f' }} />,
                placement: 'topRight',
                duration: 4.5,
                style: {
                    backgroundColor: '#fff2f0',
                    border: '1px solid #ffccc7'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <span>
                    <SendOutlined style={{ marginRight: 8 }} />
                    Cancel Request
                </span>
            }
            open={visible}
            onOk={handleCancel}
            onCancel={onClose}
            okText="Yes, Cancel"
            okType="danger"
            cancelText="Cancel"
            confirmLoading={loading}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                    <QuestionCircleOutlined style={{ marginTop: '4px', color: '#1890ff' }} />
                    <div>
                        <p>Are you sure you want to cancel request {id ? `ID ${id}` : "this request"}?</p>
                        <p>Once cancelled, the status will change to "Canceled".</p>
                    </div>
                </div>

                <div>
                    <TextArea
                        placeholder="Add a comment (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default CancelRequest;
