import { useState } from "react";
import { Modal, notification, Input } from "antd";
import { RollbackOutlined, QuestionCircleOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

interface ReturnRequestProps {
    id: string | null;
    visible: boolean;
    onReturn: (id: string, comment: string) => Promise<void>;
    onCancel: () => void;
}

const ReturnRequest: React.FC<ReturnRequestProps> = ({ id, visible, onReturn, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');

    const handleReturn = async () => {
        if (id === null) return;
        setLoading(true);
        try {
            await onReturn(id, comment);
            notification.open({
                message: 'Success',
                description: 'Request has been returned to Draft successfully.',
                icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
                placement: 'topRight',
                duration: 4.5,
                style: {
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f'
                }
            });
            setComment(''); // Reset comment
            onCancel(); // Close modal
        } catch (error) {
            notification.open({
                message: 'Error',
                description: 'Failed to return request to Draft.',
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
                    <RollbackOutlined style={{ marginRight: 8 }} />
                    Return Request to Draft
                </span>
            }
            open={visible}
            onOk={handleReturn}
            onCancel={onCancel}
            okText="Yes, Return"
            okType="primary"
            cancelText="Cancel"
            confirmLoading={loading}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                    <QuestionCircleOutlined style={{ marginTop: '4px', color: '#1890ff' }} />
                    <div>
                        <p>Are you sure you want to return request {id ? `ID ${id}` : "this request"} to Draft?</p>
                        <p>Once returned, the status will change back to "Draft".</p>
                    </div>
                </div>
                
                <div>
                    <Input.TextArea
                        placeholder="Add a reason for returning to Draft (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ReturnRequest;
