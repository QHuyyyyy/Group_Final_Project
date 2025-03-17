import { useState } from "react";
import { Modal, Input } from "antd";
import { SendOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            toast.success('Request has been sent for approval successfully');
            setComment('');
            onCancel();
        } catch (_) {
            toast.error('Failed to send request for approval');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
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
        </>
    );
};

export default SendRequest;
