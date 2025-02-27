import { useState } from "react";
import { Modal, notification } from "antd";
import { SendOutlined, QuestionCircleOutlined } from '@ant-design/icons';

interface SendRequestProps {
    id: string | null;
    visible: boolean;
    onSend: (id: string) => Promise<void>;
    onCancel: () => void;
}

const SendRequest: React.FC<SendRequestProps> = ({ id, visible, onSend, onCancel }) => {
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (id === null) return;
        setLoading(true);
        try {
            await onSend(id);
            notification.success({
                message: "Request Sent",
                description: `Request ID ${id} has been sent for approval.`,
                icon: <SendOutlined style={{ color: '#52c41a' }} />
            });
        } catch (error) {
            notification.error({
                message: "Send Failed",
                description: "Failed to send request for approval.",
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
            <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                <QuestionCircleOutlined style={{ marginTop: '4px', color: '#1890ff' }} />
                <div>
                    <p>Are you sure you want to send request {id ? `ID ${id}` : "this request"} for approval?</p>
                    <p>Once sent, the status will change to "Pending Approval".</p>
                </div>
            </div>
        </Modal>
    );
};

export default SendRequest;
