import { useState } from "react";
import { Modal, notification } from "antd";

interface SendRequestProps {
    id: number | null;
    visible: boolean;
    onSend: (id: number) => void;
    onCancel: () => void;
}

const SendRequest: React.FC<SendRequestProps> = ({ id, visible, onSend, onCancel }) => {
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (id === null) return;
        setLoading(true);


        setTimeout(() => {
            onSend(id);
            setLoading(false);
            notification.success({
                message: "Request Sent",
                description: `Request ID ${id} has been sent for approval.`,
            });
        }, 1000);
    };

    return (
        <Modal
            title="Send Request for Approval"
            open={visible}
            onOk={handleSend}
            onCancel={onCancel}
            okText="Yes, Send"
            okType="primary"
            cancelText="Cancel"
            confirmLoading={loading}
        >
            <p>Are you sure you want to send request {id ? `ID ${id}` : "this request"} for approval?</p>
            <p>Once sent, the status will change to "Pending Approval".</p>
        </Modal>
    );
};

export default SendRequest;
