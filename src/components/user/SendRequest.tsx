import { useState } from "react";
import { Modal, notification, Input } from "antd";
import { SendOutlined, QuestionCircleOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

interface SendRequestProps {
    id: string | null;
    visible: boolean;
    onSend: (id: string, comment: string) => Promise<void>;
    onCancel: () => void;
}

const SendRequest: React.FC<SendRequestProps> = ({ id, visible, onSend, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');

    const handleSend = async () => {
        if (id === null) return;
        setLoading(true);
        try {
            await onSend(id, comment);
            notification.open({
                message: 'Success',
                description: 'Request has been sent for approval successfully.',
                icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
                placement: 'topRight',
                duration: 4.5,
                style: {
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f'
                }
            });
            setComment('');
            onCancel();
        } catch (error) {
            notification.open({
                message: 'Error',
                description: 'Failed to send request for approval.',
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
                    Send Request for Approval
                </span>
            }
            open={visible}
            onOk={handleSend}
            onCancel={onCancel}
            okText="Yes, Send"
            okType="primary"
            cancelText="Cancel"
            confirmLoading={loading}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                    <QuestionCircleOutlined style={{ marginTop: '4px', color: '#1890ff' }} />
                    <div>
                        <p>Are you sure you want to send request {id ? `ID ${id}` : "this request"} for approval?</p>
                        <p>Once sent, the status will change to "Pending Approval".</p>
                    </div>
                </div>

                <div>
                    <Input.TextArea
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

export default SendRequest;
